import React, { useEffect, useState } from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useLeverage, useModal, useZap } from '@/hooks';
import {
    TransactionStatus,
    Button,
    PillDisplay,
    AssetDisplay,
    DefaultAccordion,
    CoinInput,
    HealthFactor,
    MessageStatus,
} from '@/ui/components';
import { ILeverageProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { Slider as MUISlider } from '@mui/material';
import {
    Address,
    erc20ABI,
    multicall,
    prepareWriteContract,
    readContract,
    writeContract,
} from '@wagmi/core';
import {
    LendingPoolABI,
    VeloPoolABI,
    VariableDebtTokenABI,
    LeverageControllerABI,
} from '@/utils/abis';
import {
    AVAILABLE_COLLATERAL_TRESHOLD,
    NETWORKS,
    bigNumberToNative,
    bigNumberToUnformattedString,
    getNetworkName,
    unformattedStringToBigNumber,
    calculateTotalBorrowAmount,
    formatUsdUnits,
    isAddressEqual,
    isUnwindTwoBorrow,
    toSymbol,
    toAddress,
    cleanNumberString,
    calculateHealthFactorAfterLeverage,
    TESTING,
    calculateRepayAmount,
    isTrancheIdEqual,
    isPoolStable,
    calculateCurrentApy,
} from '@/utils';
import { useAccount } from 'wagmi';
import { BigNumber, constants, utils } from 'ethers';
import {
    useLoopData,
    useSubgraphAllMarketsData,
    useSubgraphTrancheData,
    useUserData,
    useUserTrancheData,
} from '@/api';
import { getAddress, parseUnits } from 'ethers/lib/utils.js';
import { convertAddressListToSymbol } from '@vmexfinance/sdk';
import { toast } from 'react-toastify';
import Decimal from 'decimal.js';
import { parseEther } from 'viem';

const VERY_BIG_ALLOWANCE = BigNumber.from(2).pow(128); // big enough
const ONE_ETHER = parseEther('1');

type LeverageDetails = {
    token0: Address;
    decimals0: BigNumber;
    token1: Address;
    decimals1: BigNumber;
    stable: boolean;
    variableDebtTokenAddress: Address;
};

export const LeverageAssetDialog: React.FC<ILeverageProps> = ({ data }) => {
    const modalProps = useModal('leverage-asset-dialog');
    const navigate = useNavigate();
    const { address } = useAccount();
    const { setAsset } = useSelectedTrancheContext();
    const { closeDialog } = useDialogController();
    const { address: wallet } = useAccount();
    const { queryUserActivity } = useUserData(wallet);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();
    const network = getNetworkName();

    const _data = data
        ? data
        : {
              asset: '',
              trancheId: '',
              collateral: '',
              amount: '',
              looping: 0,
              totalApy: '',
              ltv: new Decimal(0),
          };
    const { asset, trancheId, collateral, amount, looping, totalApy, ltv } = _data; // TODO: move functionality to leverage and zap hooks

    const { findLoop } = useLoopData(address);
    const loopedAsset = findLoop(toAddress(asset));

    const {
        view,
        setView,
        isLoading,
        isSuccess,
        error,
        estimatedGasCost,
        isButtonDisabled,
        setAmount,
        amountWithdraw,
        isMax,
        setIsMax,
        isViolatingMax,
        maxOnClick,
        amount: withdrawAmount,
    } = useLeverage({ data, ...modalProps });

    const [errMsg, setErrMsg] = useState('');
    const { queryUserTrancheData } = useUserTrancheData(wallet, trancheId);
    const { findAssetInMarketsData } = useSubgraphTrancheData(trancheId as number);

    const [_collateral, _setCollateral] = useState(collateral);
    const [_looping, _setLooping] = useState(looping);
    const [_loading, _setLoading] = useState(false);

    const collaterals = _collateral ? _collateral.split(':') : [];

    const collateralSymbols =
        collaterals.length && asset ? convertAddressListToSymbol(collaterals, network) : [];
    const assetSymbol = asset ? toSymbol(asset) : '';
    const collateralMarketData = collaterals?.map((x) => {
        const marketData = queryAllMarketsData.data?.find(
            (y) => isTrancheIdEqual(y.trancheId, trancheId) && isAddressEqual(y.assetAddress, x),
        );
        return marketData || { borrowApy: '', decimals: 18 };
    });

    const mostBorrowedTokens = queryUserTrancheData.data?.borrows.sort((a, b) =>
        b.amount.localeCompare(a.amount),
    );

    const suppliedAssetDetails =
        asset &&
        queryUserActivity.data?.supplies.find(
            (el) => utils.getAddress(el?.assetAddress) === getAddress(toAddress(asset)),
        );

    const totalBorrowAmount = calculateTotalBorrowAmount(
        queryUserActivity.data?.availableBorrowsETH || '0',
        _looping,
        ltv,
    );
    const currentApy = calculateCurrentApy(amount, totalBorrowAmount, totalApy);

    const [borrowAllowance, setBorrowAllowance] = useState(BigNumber.from(0));
    const [leverageDetails, setLeverageDetails] = useState<LeverageDetails>();

    const CHAIN_CONFIG = NETWORKS[network];

    const handleCollateralClick = (address: string) => {
        if (errMsg) setErrMsg('');
        _setCollateral(address);
    };

    const handleSlide = (e: Event) => {
        e.stopPropagation();
        _setLooping((e.target as any).value || 1);
    };

    const approveBorrowDelegation = async () => {
        if (!_collateral) {
            setErrMsg('Must provide collateral first');
            return;
        }
        if (!leverageDetails || !network) {
            toast.error('Error getting leverage details');
            _setLoading(false);
            return;
        } // TODO: better error handling

        const config = await prepareWriteContract({
            address: leverageDetails.variableDebtTokenAddress,
            abi: VariableDebtTokenABI,
            functionName: 'approveDelegation',
            args: [CHAIN_CONFIG.leverageControllerAddress, constants.MaxUint256],
        });
        setBorrowAllowance(constants.MaxUint256);
        const tx = await writeContract(config);

        return tx.wait();
    };

    const leverageVeloZap = async () => {
        if (!leverageDetails || !network || !amount) {
            toast.error('Please enter an amount');
            return;
        } // TODO: better error handling
        const { token0, decimals0, token1, decimals1, stable } = leverageDetails;

        if (isAddressEqual(token0, _collateral) || isAddressEqual(token1, _collateral)) {
            const params: any = {
                lpToken: utils.getAddress(toAddress(asset)),
                trancheId: BigNumber.from(trancheId),
                token0,
                decimals0,
                token1,
                decimals1,
                stable,
            };
            const isBorrowToken0 = isAddressEqual(_collateral, token0);
            if (!totalBorrowAmount) return;
            const config = await prepareWriteContract({
                address: CHAIN_CONFIG.leverageControllerAddress,
                abi: LeverageControllerABI,
                functionName: 'leverageVeloLpZap',
                args: [params, totalBorrowAmount, isBorrowToken0],
            });

            const tx = await writeContract(config);

            return tx.wait();
        } else {
            const params: any = {
                lpToken: utils.getAddress(toAddress(asset)),
                trancheId: BigNumber.from(trancheId),
                token0,
                decimals0,
                token1,
                decimals1,
                stable,
            };

            const borrowParams = {
                token: getAddress(_collateral),
                decimals: BigNumber.from(collateralMarketData[0].decimals),
                stable0: isPoolStable(network, token0, _collateral),
                stable1: isPoolStable(network, token1, _collateral),
            };

            if (!totalBorrowAmount) return;
            console.log('borrow other', params, totalBorrowAmount.toString(), borrowParams);
            const config = await prepareWriteContract({
                address: CHAIN_CONFIG.leverageControllerAddress,
                abi: LeverageControllerABI,
                functionName: 'leverageVeloLpBorrowOther',
                args: [params, totalBorrowAmount, borrowParams],
            });

            const tx = await writeContract(config);

            return tx.wait();
        }
    };

    const getCollateralAssets = (token0: string, token1: string) => {
        if (!queryAllMarketsData.data) {
            return [];
        }
        const collateralAssets = [];

        const borrowableAssets = queryAllMarketsData.data.filter((x) => {
            if (x.trancheId !== trancheId?.toString() || !x.canBeBorrowed) return false;
            return AVAILABLE_COLLATERAL_TRESHOLD.lt(parseUnits(String(x.available), 8));
        });
        // if both underyling tokens for LP are borrowable, show Underyling
        if (
            borrowableAssets.filter(
                (x) =>
                    x.assetAddress.toLowerCase() === token0.toLowerCase() ||
                    x.assetAddress.toLowerCase() === token1.toLowerCase(),
            ).length === 2
        ) {
            collateralAssets.push({
                assetName: 'Underlying',
                assetAddress: `${token0}:${token1}`,
            });
        }
        collateralAssets.push(
            ...borrowableAssets.map((x) => {
                return { assetName: x.asset, assetAddress: x.assetAddress };
            }),
        );

        collateralAssets.sort((a, b) => {
            if (a.assetName === 'Underlying') return -1;
            if (b.assetName === 'Underyling') return 1;
            if ([token0.toLowerCase(), token1.toLowerCase()].includes(a.assetAddress.toLowerCase()))
                return -1;
            if ([token0.toLowerCase(), token1.toLowerCase()].includes(b.assetAddress.toLowerCase()))
                return 1;
            return 0;
        });

        return collateralAssets;
    };

    const populateHowItWorks = () => {
        let currTotalBorrowAmount = BigNumber.from(totalBorrowAmount.toString());
        const userBorrowableAmount = queryUserActivity?.data?.availableBorrowsETH;
        const steps: string[] = [];
        if (userBorrowableAmount) {
            const availableBorrowUsd = parseUnits(cleanNumberString(userBorrowableAmount), 18)
                .mul(9)
                .div(10);
            while (currTotalBorrowAmount.gt(0)) {
                const borrowAmountUsd = availableBorrowUsd.lt(currTotalBorrowAmount)
                    ? availableBorrowUsd
                    : currTotalBorrowAmount;
                if (collateralSymbols.length === 1) {
                    steps.push(
                        `Borrow ${formatUsdUnits(borrowAmountUsd)} worth of ${
                            collateralSymbols[0]
                        }.`,
                    );
                    steps.push(
                        `Sell 50% of the borrowed tokens, add liquidity in Velo pool, get LP tokens.`,
                    );
                } else {
                    steps.push(
                        `Borrow ${formatUsdUnits(borrowAmountUsd.div(2))} worth of ${
                            collateralSymbols[0]
                        }.`,
                    );
                    steps.push(
                        `Borrow ${formatUsdUnits(borrowAmountUsd.div(2))} worth of ${
                            collateralSymbols[1]
                        }.`,
                    );
                    steps.push(`Add liquidity in Velo pool, get LP tokens.`);
                }
                steps.push(`Desposit ${formatUsdUnits(borrowAmountUsd)} worth of Velo LP tokens`);
                currTotalBorrowAmount = currTotalBorrowAmount.sub(borrowAmountUsd);
            }
        }
        return steps;
    };

    const populateSummary = () => {
        if (!collateralMarketData.length) return [];
        const summary = [];
        if (collaterals.length === 1) {
            summary.push(
                `Borrow total ${formatUsdUnits(totalBorrowAmount)} worth of ${
                    collateralSymbols[0]
                }, with interest rate ${(
                    parseFloat(collateralMarketData[0]?.borrowApy) * 100
                ).toFixed(4)} %`,
            );
        } else {
            summary.push(
                `Borrow total ${formatUsdUnits(totalBorrowAmount.div(2))} worth of ${
                    collateralSymbols[0]
                }, with interest rate ${(
                    parseFloat(collateralMarketData[0].borrowApy) * 100
                ).toFixed(4)} %`,
            );
            summary.push(
                `Borrow total ${formatUsdUnits(totalBorrowAmount.div(2))} worth of ${
                    collateralSymbols[1]
                }, with interest rate ${(
                    parseFloat(collateralMarketData[1].borrowApy) * 100
                ).toFixed(4)} %`,
            );
        }

        summary.push(
            `Deposit total ${formatUsdUnits(
                totalBorrowAmount,
            )} worth of ${assetSymbol} with an APY of ${totalApy} %`,
        );
        summary.push(
            `Total APY is ${(
                Number(_looping) *
                (parseFloat(totalApy) - parseFloat(collateralMarketData[0].borrowApy) * 100)
            ).toFixed(4)} %`,
        );

        return summary;
    };

    const renderButtonLabel = () => {
        if (view === 'Loop') {
            if (!_collateral) return 'Select Collateral';
            if (borrowAllowance?.lt(VERY_BIG_ALLOWANCE)) return 'Approve Delegation';
            return 'Loop';
        } else if (view === 'Unwind') {
            if (!queryUserTrancheData.data?.borrows?.length) return 'No Assets Available to Unwind';
            return 'Unwind';
        } else {
            return 'Submit Transaction';
        }
    };

    const depositAsset = findAssetInMarketsData(assetSymbol);
    const borrowAssets = collateralSymbols?.map((x) => findAssetInMarketsData(x));
    const afterLoop = calculateHealthFactorAfterLeverage(
        depositAsset,
        borrowAssets,
        totalBorrowAmount,
        queryUserTrancheData.data,
    );
    const healthFactorTooLow = afterLoop ? afterLoop < BigNumber.from('1') : true;

    const getDebt = async (token: string) => {
        if (!NETWORKS[network].lendingPoolAddress || !wallet) return BigNumber.from(0);
        const reserveData = await readContract({
            address: getAddress(NETWORKS[network].lendingPoolAddress),
            abi: LendingPoolABI,
            functionName: 'getReserveData',
            args: [utils.getAddress(token), BigNumber.from(trancheId)],
        });
        return await readContract({
            address: reserveData.variableDebtTokenAddress,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [wallet],
        });
    };

    const unwind = async () => {
        if (!wallet) return;
        if (!NETWORKS[network].leverageControllerAddress) return;
        if (!mostBorrowedTokens?.length) return;

        const leverageControllerAddress = getAddress(NETWORKS[network].leverageControllerAddress);
        const withdrawAmountNative = parseUnits(withdrawAmount, 18);
        const reserveData = findAssetInMarketsData(assetSymbol);
        if (TESTING)
            console.log('#unwind - before read:', {
                address: getAddress(reserveData.aTokenAddress),
                abi: erc20ABI,
                functionName: 'allowance',
                args: [wallet, leverageControllerAddress],
            });
        const allowance = await readContract({
            address: getAddress(reserveData.aTokenAddress),
            abi: erc20ABI,
            functionName: 'allowance',
            args: [wallet, leverageControllerAddress],
        });
        if (allowance.lt(withdrawAmountNative)) {
            if (TESTING)
                console.log('#unwind - before prepare approve params', {
                    address: getAddress(reserveData.aTokenAddress),
                    abi: erc20ABI,
                    functionName: 'approve',
                    args: [leverageControllerAddress, constants.MaxUint256],
                });
            const config = await prepareWriteContract({
                address: getAddress(reserveData.aTokenAddress),
                abi: erc20ABI,
                functionName: 'approve',
                args: [leverageControllerAddress, constants.MaxUint256],
            });
            if (TESTING) console.log('#unwind - after prepare approve params:', config);
            const tx = await writeContract(config);
            await tx.wait();
        }

        const veloPoolContract = {
            address: utils.getAddress(toAddress(asset)),
            abi: VeloPoolABI,
        };
        if (veloPoolContract.address === constants.AddressZero) return;

        const [token0, token1, stable] = await multicall({
            contracts: [
                {
                    ...veloPoolContract,
                    functionName: 'token0',
                },
                {
                    ...veloPoolContract,
                    functionName: 'token1',
                },
                {
                    ...veloPoolContract,
                    functionName: 'stable',
                },
            ],
        });

        // TODO fico -> make better decision on whether to repay just one token or two
        if (isUnwindTwoBorrow(mostBorrowedTokens, token0, token1)) {
            if (TESTING)
                console.log('#unwind - before prepare two borrow params:', {
                    address: leverageControllerAddress,
                    abi: LeverageControllerABI,
                    functionName: 'unwindVeloLeverageTwoBorrow',
                    args: [
                        {
                            trancheId: BigNumber.from(trancheId),
                            lpToken: getAddress(toAddress(asset)),
                            tokenA: token0,
                            tokenB: token1,
                            stable: stable,
                            aToken: getAddress(reserveData.aTokenAddress),
                        },
                        withdrawAmountNative
                            .mul(reserveData?.priceUSD || BigNumber.from('0'))
                            .div(ONE_ETHER),
                    ],
                });
            const config = await prepareWriteContract({
                address: leverageControllerAddress,
                abi: LeverageControllerABI,
                functionName: 'unwindVeloLeverageTwoBorrow',
                args: [
                    {
                        trancheId: BigNumber.from(trancheId),
                        lpToken: getAddress(toAddress(asset)),
                        tokenA: token0,
                        tokenB: token1,
                        stable: stable,
                        aToken: getAddress(reserveData.aTokenAddress),
                    },
                    withdrawAmountNative
                        .mul(reserveData?.priceUSD || BigNumber.from('0'))
                        .div(ONE_ETHER),
                ],
            });
            if (TESTING) console.log('#unwind - after prepare two borrow params:', config);
            return await writeContract(config);
        } else {
            const isBorrowToken0 = isAddressEqual(mostBorrowedTokens[0].assetAddress, token0);
            if (TESTING)
                console.log('#unwind - before prepare one borrow params:', {
                    address: leverageControllerAddress,
                    abi: LeverageControllerABI,
                    functionName: 'unwindVeloLeverageOneBorrow',
                    args: [
                        {
                            trancheId: BigNumber.from(trancheId),
                            lpToken: getAddress(toAddress(asset)),
                            tokenA: isBorrowToken0 ? token0 : token1,
                            tokenB: isBorrowToken0 ? token1 : token0,
                            stable: stable,
                            aToken: getAddress(reserveData.aTokenAddress),
                        },
                        withdrawAmountNative
                            .mul(reserveData?.priceUSD || BigNumber.from('0'))
                            .div(ONE_ETHER),
                    ],
                });
            const debt = await getDebt(isBorrowToken0 ? token0 : token1);
            const config = await prepareWriteContract({
                address: leverageControllerAddress,
                abi: LeverageControllerABI,
                functionName: 'unwindVeloLeverageOneBorrow',
                args: [
                    {
                        trancheId: BigNumber.from(trancheId),
                        lpToken: getAddress(toAddress(asset)),
                        tokenA: isBorrowToken0 ? token0 : token1,
                        tokenB: isBorrowToken0 ? token1 : token0,
                        stable: stable,
                        aToken: getAddress(reserveData.aTokenAddress),
                    },
                    withdrawAmountNative
                        .mul(reserveData?.priceUSD || BigNumber.from('0'))
                        .div(ONE_ETHER),
                    debt,
                ],
            });
            if (TESTING) console.log('#unwind - after prepare one borrow params:', config);
            return await writeContract(config);
        }
    };

    const determineClick = async () => {
        if (view === 'Loop') {
            if (!_collateral) {
                setErrMsg('No collateral provided');
                return;
            }
            if (borrowAllowance?.lt(VERY_BIG_ALLOWANCE)) {
                console.log('approve looping');
                await modalProps.submitTx(async () => await approveBorrowDelegation(), false);
                return;
            }
            await modalProps.submitTx(async () => await leverageVeloZap());
        } else {
            await modalProps.submitTx(async () => await unwind());
        }
    };

    useEffect(() => {
        if ((data as any)?.foundUserLoop) {
            setView('Unwind');
        }
    }, [(data as any)?.foundUserLoop]);

    useEffect(() => {
        if (!network || !wallet || !asset || !_collateral || !trancheId) return;

        (async () => {
            const veloPoolContract = {
                address: getAddress(toAddress(asset)),
                abi: VeloPoolABI,
            };
            const lendingPoolContract = {
                address: CHAIN_CONFIG.lendingPoolAddress,
                abi: LendingPoolABI,
            };

            if (
                veloPoolContract.address === constants.AddressZero &&
                lendingPoolContract.address === constants.AddressZero
            )
                return;
            const [token0, token1, stable, { variableDebtTokenAddress }] = await multicall({
                contracts: [
                    {
                        ...veloPoolContract,
                        functionName: 'token0',
                    },
                    {
                        ...veloPoolContract,
                        functionName: 'token1',
                    },
                    {
                        ...veloPoolContract,
                        functionName: 'stable',
                    },
                    {
                        ...lendingPoolContract,
                        functionName: 'getReserveData',
                        args: [utils.getAddress(_collateral), BigNumber.from(trancheId)],
                    },
                ],
            });

            const [decimals0, decimals1, currentBorrowAllowance] = await multicall({
                contracts: [
                    {
                        address: token0,
                        abi: erc20ABI,
                        functionName: 'decimals',
                    },
                    {
                        address: token1,
                        abi: erc20ABI,
                        functionName: 'decimals',
                    },
                    {
                        address: variableDebtTokenAddress,
                        abi: VariableDebtTokenABI,
                        functionName: 'borrowAllowance',
                        args: [wallet, CHAIN_CONFIG.leverageControllerAddress],
                    },
                ],
            });

            setBorrowAllowance(currentBorrowAllowance);
            setLeverageDetails({
                token0,
                decimals0: BigNumber.from(decimals0 || BigNumber.from('0')),
                token1,
                decimals1: BigNumber.from(decimals1 || BigNumber.from('0')),
                stable,
                variableDebtTokenAddress,
            });
        })().catch((err) => console.error(err));
    }, [network, wallet, _loading, _collateral]);

    const [repayAmount, setRepayAmount] = useState({ loading: false, value: '0' });
    useEffect(() => {
        (async () => {
            if (withdrawAmount) {
                setRepayAmount({ ...repayAmount, loading: true });
                const _repayAmount = await calculateRepayAmount(
                    withdrawAmount,
                    amountWithdraw,
                    loopedAsset?.borrowAmountNative,
                    asset,
                    loopedAsset?.borrowAsset,
                );
                setRepayAmount({ loading: false, value: _repayAmount });
            }
        })().catch((err) => console.error(err));
    }, [withdrawAmount]);

    return (
        <>
            <ModalHeader
                dialog="leverage-asset-dialog"
                tabs={['Loop', 'Unwind']}
                onClick={setView}
                disabled={isLoading}
                active={view}
            />
            {!isSuccess && !error ? (
                // Default State
                <>
                    {view === 'Loop' ? (
                        <>
                            <div className={``}>
                                <div className="flex items-start justify-between mt-5 px-1">
                                    <AssetDisplay
                                        name={(data as any)?.symbol || asset}
                                        size={'lg'}
                                    />
                                    <div className="flex-col items-end hidden sm:flex">
                                        <span className="text-xl leading-none">{`${
                                            (data as any)?.tranche || ''
                                        }`}</span>
                                        <span className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                                            Tranche
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start justify-between mt-4 px-2">
                                    <div className="flex flex-col items-start">
                                        <span className="text-2xl leading-none">{`${currentApy}%`}</span>
                                        <span className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                                            Asset APY
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl leading-none">{`${_looping}x`}</span>
                                        <span className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                                            Looping
                                        </span>
                                    </div>
                                </div>

                                <ModalTableDisplay
                                    title="APY Breakdown"
                                    content={(data as any)?.apyBreakdown || []}
                                />

                                <div>
                                    <p
                                        className={`text-xs leading-tight mt-4 ${
                                            errMsg ? 'text-red-600' : ''
                                        }`}
                                    >
                                        Select one of the following assets to borrow:
                                    </p>
                                    <div className="flex gap-1 flex-wrap mt-1">
                                        {getCollateralAssets(
                                            (data as any)?.token0 || '',
                                            (data as any)?.token1 || '',
                                        ).map((el, i) => (
                                            <button
                                                onClick={(e) =>
                                                    handleCollateralClick(el.assetAddress)
                                                }
                                                key={`collateral-asset-${el}-${i}`}
                                            >
                                                <PillDisplay
                                                    type="asset"
                                                    asset={el.assetName}
                                                    size="sm"
                                                    hoverable
                                                    selected={
                                                        el.assetAddress.toLowerCase() ===
                                                        _collateral.toLowerCase()
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className={`text-xs`}>Looping:</p>
                                    <div className="px-4">
                                        <MUISlider
                                            aria-label="looping slider steps"
                                            defaultValue={1}
                                            step={1}
                                            marks
                                            min={1}
                                            max={(data as any)?.maxLooping || 3}
                                            valueLabelDisplay="auto"
                                            size="small"
                                            value={_looping}
                                            onChange={handleSlide}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <DefaultAccordion
                                        wrapperClass="!border-0 "
                                        disabled={!_collateral}
                                        customHover="hover:!text-brand-purple"
                                        detailsClass="!bg-white dark:!bg-brand-black !border-0"
                                        className="!px-0 !hover:!bg-inherit !bg-white dark:!bg-brand-black dark:disabled:!opacity-100 "
                                        title={`how-it-works-summary`}
                                        summary={<span>How it works</span>}
                                        details={
                                            <ol className="list-decimal mx-7 text-sm">
                                                {populateHowItWorks().map((v, i) => (
                                                    <li key={i?.toString()}>{v}</li>
                                                ))}
                                            </ol>
                                        }
                                    />
                                </div>

                                <DefaultAccordion
                                    wrapperClass="!border-0"
                                    customHover="hover:!text-brand-purple"
                                    detailsClass="!bg-white !border-0 dark:!bg-brand-black"
                                    disabled={!_collateral}
                                    className="!px-0 !hover:!bg-inherit !bg-white dark:!bg-brand-black disabled:!opacity-100"
                                    title={`strategy-summary`}
                                    summary={<span>Summary</span>}
                                    details={
                                        <ol className="list-decimal mx-7 text-sm">
                                            {populateSummary().map((v, i) => (
                                                <li key={i?.toString()}>{v}</li>
                                            ))}
                                        </ol>
                                    }
                                />

                                <h3 className="mt-4 text-neutral400">Health Factor</h3>
                                <HealthFactor
                                    asset={asset || 'ETH'}
                                    amount={amount}
                                    type={'loop'}
                                    trancheId={String(trancheId)}
                                    collateral={_collateral}
                                    looping={_looping}
                                    ltv={ltv}
                                    borrowable={queryUserActivity.data?.availableBorrowsETH}
                                />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Your Supply',
                                            value: (suppliedAssetDetails as any)?.amount || '$0',
                                        },
                                        {
                                            label: 'Estimated Gas',
                                            value: estimatedGasCost?.cost,
                                            loading: estimatedGasCost?.loading,
                                            error: estimatedGasCost?.errorMessage,
                                        },
                                    ]}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-4 flex justify-between items-center">
                                <h3>Withdraw Amount</h3>
                            </div>
                            <CoinInput
                                amount={withdrawAmount}
                                setAmount={setAmount}
                                coin={{
                                    logo: `/coins/${
                                        (_data as any)?.symbol?.toLowerCase() || 'eth'
                                    }.svg`,
                                    name: (_data as any)?.symbol || 'ETH',
                                }}
                                balance={bigNumberToUnformattedString(
                                    amountWithdraw || BigNumber.from('0'),
                                    asset || 'ETH',
                                )}
                                isMax={isMax}
                                setIsMax={setIsMax}
                                loading={
                                    Number(
                                        bigNumberToNative(
                                            amountWithdraw || BigNumber.from('0'),
                                            asset || 'ETH',
                                        ),
                                    ) === 0
                                }
                                customMaxClick={maxOnClick}
                            />
                            <MessageStatus
                                type="error"
                                show={isViolatingMax()}
                                message="Input amount is over the max."
                                icon
                            />

                            <div className="mt-4 flex justify-between items-center">
                                <h3>Repay Amount</h3>
                            </div>
                            <CoinInput
                                amount={repayAmount.value}
                                coin={{
                                    logo: `/coins/${
                                        loopedAsset?.borrowAsset?.toLowerCase() || 'eth'
                                    }.svg`,
                                    name: loopedAsset?.borrowAsset || 'ETH',
                                }}
                                loading={repayAmount.loading}
                            />

                            <h3 className="mt-3 2xl:mt-4 text-neutral400">Health Factor</h3>
                            <HealthFactor
                                asset={asset || 'ETH'}
                                amount={withdrawAmount}
                                type={'unwind'}
                                trancheId={String(trancheId)}
                                collateral={_collateral}
                                looping={_looping}
                                ltv={ltv}
                                borrowable={queryUserActivity.data?.availableBorrowsETH}
                            />

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={[
                                    {
                                        label: 'Remaining Supply',
                                        value: Math.abs(
                                            Number(
                                                amount && amountWithdraw
                                                    ? bigNumberToNative(
                                                          amountWithdraw.sub(
                                                              unformattedStringToBigNumber(
                                                                  amount || '0',
                                                                  asset || 'ETH',
                                                              ),
                                                          ) || BigNumber.from('0'),
                                                          asset || 'ETH',
                                                      )
                                                    : bigNumberToNative(
                                                          amountWithdraw || BigNumber.from('0'),
                                                          asset || 'ETH',
                                                      ),
                                            ),
                                        ),
                                        loading:
                                            Number(
                                                bigNumberToNative(
                                                    amountWithdraw || BigNumber.from('0'),
                                                    asset || 'ETH',
                                                ),
                                            ) === 0,
                                    },
                                    {
                                        label: 'Estimated Gas',
                                        value: estimatedGasCost.cost,
                                        loading: estimatedGasCost.loading,
                                    },
                                ]}
                            />
                        </>
                    )}
                </>
            ) : (
                <div className="mt-8 mb-6">
                    <TransactionStatus full success={isSuccess} errorText={error} />
                </div>
            )}

            <div className={``}>
                <ModalFooter between={!location.hash.includes('tranches')}>
                    {!location.hash.includes('tranches') && (
                        <Button
                            type="outline"
                            onClick={() => {
                                setAsset(asset);
                                closeDialog('leverage-asset-dialog');
                                window.scroll(0, 0);
                                navigate(
                                    `/tranches/${data?.tranche
                                        ?.toLowerCase()
                                        .replace(/\s+/g, '-')}`,
                                    {
                                        state: {
                                            action: 'supply',
                                            trancheId: data?.trancheId,
                                            asset: assetSymbol,
                                        },
                                    },
                                );
                            }}
                        >
                            Supply More
                        </Button>
                    )}
                    <Button
                        type="accent"
                        disabled={
                            isButtonDisabled() ||
                            (view === 'Unwind' && !queryUserTrancheData?.data?.borrows?.length) ||
                            (view === 'Loop' && !_collateral) ||
                            (view === 'Loop' && healthFactorTooLow)
                        }
                        onClick={determineClick}
                        loading={isLoading || _loading}
                        loadingText={
                            view === 'Loop' && borrowAllowance?.lt(VERY_BIG_ALLOWANCE)
                                ? 'Approving'
                                : 'Submitting'
                        }
                    >
                        {renderButtonLabel()}
                    </Button>
                </ModalFooter>
            </div>
        </>
    );
};

import React, { useEffect, useState } from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useLeverage, useModal, useZap } from '@/hooks';
import {
    TransactionStatus,
    Button,
    SkeletonLoader,
    PillDisplay,
    AssetDisplay,
    DefaultAccordion,
} from '@/ui/components';
import { ILeverageProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { Address, erc20ABI, multicall, prepareWriteContract, writeContract } from '@wagmi/core';
import {
    LendingPoolABI,
    VeloPoolABI,
    VariableDebtTokenABI,
    LeverageControllerABI,
} from '@/utils/abis';
import { AVAILABLE_COLLATERAL_TRESHOLD, NETWORKS, getNetworkName } from '@/utils';
import { useAccount } from 'wagmi';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useSubgraphAllMarketsData, useUserData } from '@/api';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { convertAddressListToSymbol, convertAddressToSymbol } from '@vmexfinance/sdk';
import { toast } from 'react-toastify';

const VERY_BIG_ALLOWANCE = BigNumber.from(2).pow(128); // big enough

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
    const { setAsset } = useSelectedTrancheContext();
    const { closeDialog } = useDialogController();
    const { address: wallet } = useAccount();
    const { queryUserActivity } = useUserData(wallet);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();
    const { view, setView, isLoading, isSuccess, error, estimatedGasCost, isButtonDisabled } =
        useLeverage({ data, ...modalProps });
    const network = getNetworkName();
    const _data = data
        ? data
        : { asset: '', trancheId: '', collateral: '', amount: '', leverage: 0, totalApy: '' };
    const [errMsg, setErrMsg] = useState('');
    const { asset, trancheId, collateral, amount, leverage, totalApy } = _data; // TODO: move functionality to leverage and zap hooks

    const [_collateral, _setCollateral] = useState(collateral);

    const collaterals = _collateral ? _collateral.split(':') : [];
    const collateralSymbols =
        collaterals.length && asset ? convertAddressListToSymbol(collaterals, network) : [];
    const assetSymbol = asset ? convertAddressToSymbol(asset, network) : '';
    let collateralMarketData = collaterals.map((x) => {
        const marketData = queryAllMarketsData.data?.find(
            (y) =>
                y.trancheId === trancheId?.toString() &&
                y.assetAddress.toLowerCase() === x.toLowerCase(),
        );
        if (!marketData) return { borrowApy: '' };
        return marketData;
    });

    const { zappableAssets, handleZap } = useZap(asset);

    const suppliedAssetDetails =
        asset &&
        queryUserActivity.data?.supplies.find(
            (el) => utils.getAddress(el?.assetAddress) === utils.getAddress(asset),
        );

    const [borrowAllowance, setBorrowAllowance] = useState(BigNumber.from(0));
    const [leverageDetails, setLeverageDetails] = useState<LeverageDetails>();

    const handleCollateralClick = (address: string) => {
        if (errMsg) setErrMsg('');
        _setCollateral(address);
    };

    const approveBorrowDelegation = async () => {
        if (!collateral) {
            setErrMsg('Must provide collateral first');
            return;
        }
        if (!leverageDetails || !network) {
            toast.error('Error getting leverage details');
            return;
        } // TODO: better error handling

        const CHAIN_CONFIG = NETWORKS[network];
        const config = await prepareWriteContract({
            address: leverageDetails.variableDebtTokenAddress,
            abi: VariableDebtTokenABI,
            functionName: 'approveDelegation',
            args: [CHAIN_CONFIG.leverageControllerAddress, constants.MaxUint256],
        });
        const data = await writeContract(config);
        await data.wait();
        setBorrowAllowance(constants.MaxUint256);
    };

    const leverageVeloZap = async () => {
        if (!leverageDetails || !network || !amount) {
            toast.error('Please enter an amount');
            return;
        } // TODO: better error handling
        const CHAIN_CONFIG = NETWORKS[network];
        const { token0, decimals0, token1, decimals1, stable } = leverageDetails;
        const params = {
            lpToken: utils.getAddress(asset),
            trancheId: BigNumber.from(trancheId),
            token0,
            decimals0,
            token1,
            decimals1,
            stable,
        };
        const totalBorrowAmount = calculateTotalBorrowAmount(amount, leverage);
        const isBorrowToken0 = utils.getAddress(_collateral) === utils.getAddress(token0);
        if (!totalBorrowAmount) return;
        const config = await prepareWriteContract({
            address: CHAIN_CONFIG.leverageControllerAddress,
            abi: LeverageControllerABI,
            functionName: 'leverageVeloLpZap',
            args: [params, totalBorrowAmount, isBorrowToken0],
        });

        const data = await writeContract(config);
        await data.wait();
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

    const calculateTotalBorrowAmount = (amountHumanReadable: string, leverage: number) => {
        if (!amountHumanReadable || !leverage) return ethers.BigNumber.from(0);
        return utils
            .parseUnits(amountHumanReadable.replace('$', ''), 8)
            .mul((leverage * 100).toFixed(0))
            .div(100);
    };

    const populateHowItWorks = () => {
        let totalBorrowAmount = calculateTotalBorrowAmount(amount, leverage);
        const userBorrowableAmount = queryUserActivity?.data?.availableBorrowsETH;
        const steps: string[] = [];
        if (userBorrowableAmount) {
            const availableBorrowUsd = parseUnits(userBorrowableAmount, 18).mul(9).div(10);
            while (totalBorrowAmount.gt(0)) {
                const borrowAmountUsd = availableBorrowUsd.lt(totalBorrowAmount)
                    ? availableBorrowUsd
                    : totalBorrowAmount;
                if (collateralSymbols.length === 1) {
                    steps.push(
                        `Borrow $${formatUnits(borrowAmountUsd, 8)} worth of ${
                            collateralSymbols[0]
                        }.`,
                    );
                    steps.push(
                        `Sell 50% of the borrowed tokens, add liquidity in Velo pool, get LP tokens.`,
                    );
                } else {
                    steps.push(
                        `Borrow $${formatUnits(borrowAmountUsd.div(2), 8)} worth of ${
                            collateralSymbols[0]
                        }.`,
                    );
                    steps.push(
                        `Borrow $${formatUnits(borrowAmountUsd.div(2), 8)} worth of ${
                            collateralSymbols[1]
                        }.`,
                    );
                    steps.push(`Add liquidity in Velo pool, get LP tokens.`);
                }
                steps.push(`Desposit ${formatUnits(borrowAmountUsd, 8)} worth of Velo LP tokens`);
                totalBorrowAmount = totalBorrowAmount.sub(borrowAmountUsd);
            }
        }
        return steps;
    };

    const populateSummary = () => {
        if (!collateralMarketData.length) return [];
        const totalBorrowAmount = calculateTotalBorrowAmount(amount, leverage);
        const summary = [];
        if (collaterals.length === 1) {
            summary.push(
                `Borrow total $${formatUnits(totalBorrowAmount, 8)} worth of ${
                    collateralSymbols[0]
                }, with interest rate ${(
                    parseFloat(collateralMarketData[0]?.borrowApy) * 100
                ).toFixed(4)} %`,
            );
        } else {
            summary.push(
                `Borrow total ${formatUnits(totalBorrowAmount.div(2), 8)} worth of ${
                    collateralSymbols[0]
                }, with interest rate ${(
                    parseFloat(collateralMarketData[0].borrowApy) * 100
                ).toFixed(4)} %`,
            );
            summary.push(
                `Borrow total ${formatUnits(totalBorrowAmount.div(2), 8)} worth of ${
                    collateralSymbols[1]
                }, with interest rate ${(
                    parseFloat(collateralMarketData[1].borrowApy) * 100
                ).toFixed(4)} %`,
            );
        }

        summary.push(
            `Deposit total ${formatUnits(
                totalBorrowAmount,
                8,
            )} worth of ${assetSymbol} with apy ${totalApy} %`,
        );
        summary.push(
            `Total apy ${(
                parseFloat(totalApy) -
                parseFloat(collateralMarketData[0].borrowApy) * 100
            ).toFixed(4)} %`,
        );

        return summary;
    };

    useEffect(() => {
        if (network && wallet) {
            (async () => {
                const CHAIN_CONFIG = NETWORKS[network];

                const veloPoolContract = {
                    address: utils.getAddress(asset),
                    abi: VeloPoolABI,
                };
                const lendingPoolContract = {
                    address: CHAIN_CONFIG.lendingPoolAddress,
                    abi: LendingPoolABI,
                };

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

                const [decimals0, decimals1, borrowAllowance] = await multicall({
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

                setBorrowAllowance(borrowAllowance);
                setLeverageDetails({
                    token0,
                    decimals0: BigNumber.from(decimals0),
                    token1,
                    decimals1: BigNumber.from(decimals1),
                    stable,
                    variableDebtTokenAddress,
                });
            })().catch((err) => console.error(err));
        }
    }, [network, wallet]);

    if (data)
        return (
            <>
                <ModalHeader
                    dialog="leverage-asset-dialog"
                    tabs={['Looping']}
                    onClick={setView}
                    disabled={isLoading}
                />
                {!isSuccess && !error ? (
                    // Default State
                    <>
                        {zappableAssets.length !== 0 && (
                            <>
                                <div className="mt-3 2xl:mt-4 flex justify-between items-center">
                                    <h3>Zap</h3>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {isLoading ? (
                                        <SkeletonLoader variant="rounded" className="!rounded-3xl">
                                            <PillDisplay type="asset" asset={'BTC'} value={0} />
                                        </SkeletonLoader>
                                    ) : (
                                        zappableAssets.map((el, i) => (
                                            <button
                                                key={`top-supplied-asset-${i}`}
                                                onClick={handleZap}
                                            >
                                                <PillDisplay
                                                    type="asset"
                                                    asset={el.symbol}
                                                    hoverable
                                                />
                                            </button>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        <div className="flex items-start justify-between mt-4 px-1">
                            <AssetDisplay name={(data as any)?.symbol} size={'lg'} />
                            <div className="flex flex-col items-end">
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
                                <span className="text-2xl leading-none">{`${
                                    (data as any)?.totalApy || 0
                                }%`}</span>
                                <span className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                                    Asset APY
                                </span>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-2xl leading-none">{`${
                                    (data as any)?.leverage || 0
                                }x`}</span>
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
                                Provide any of the assets as collateral:
                            </p>
                            <div className="flex gap-1 flex-wrap mt-1">
                                {getCollateralAssets(
                                    (data as any)?.token0 || '',
                                    (data as any)?.token1 || '',
                                ).map((el, i) => (
                                    <button
                                        onClick={(e) => handleCollateralClick(el.assetAddress)}
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

                        <div className="mt-2">
                            <DefaultAccordion
                                wrapperClass="!border-0"
                                disabled={!_collateral}
                                customHover="hover:!text-brand-purple"
                                detailsClass="!bg-white dark:!bg-brand-black !border-0"
                                className="!px-0 !hover:!bg-inherit !bg-white dark:!bg-brand-black dark:disabled:!opacity-100"
                                title={`how-it-works-summary`}
                                summary={<span>How it works</span>}
                                details={
                                    <ol className="list-decimal mx-6 text-sm">
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
                                <ol className="list-decimal mx-6 text-sm">
                                    {populateSummary().map((v, i) => (
                                        <li key={i?.toString()}>{v}</li>
                                    ))}
                                </ol>
                            }
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
                    </>
                ) : (
                    <div className="mt-8 mb-6">
                        <TransactionStatus full success={isSuccess} errorText={error} />
                    </div>
                )}

                <ModalFooter between={!location.hash.includes('tranches')}>
                    {!location.hash.includes('tranches') && (
                        <Button
                            label={`View Tranche`}
                            onClick={() => {
                                setAsset(asset);
                                closeDialog('leverage-asset-dialog');
                                window.scroll(0, 0);
                                navigate(
                                    `/tranches/${data?.tranche
                                        ?.toLowerCase()
                                        .replace(/\s+/g, '-')}`,
                                    {
                                        state: { view: 'details', trancheId: data?.trancheId },
                                    },
                                );
                            }}
                        />
                    )}
                    <Button
                        primary
                        disabled={isButtonDisabled()}
                        onClick={
                            borrowAllowance?.lt(VERY_BIG_ALLOWANCE)
                                ? approveBorrowDelegation
                                : leverageVeloZap
                        }
                        label={
                            borrowAllowance?.lt(VERY_BIG_ALLOWANCE)
                                ? 'Approve Delegation'
                                : 'Submit Transaction'
                        }
                        loading={isLoading}
                        loadingText={
                            borrowAllowance?.lt(VERY_BIG_ALLOWANCE) ? 'Approving' : 'Submitting'
                        }
                    />
                </ModalFooter>
            </>
        );
    return <></>;
};

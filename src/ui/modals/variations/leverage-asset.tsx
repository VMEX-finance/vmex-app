import React, { useEffect, useState } from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useLeverage, useModal, useZap } from '@/hooks';
import {
    TransactionStatus,
    Button,
    SkeletonLoader,
    PillDisplay,
    AssetDisplay,
} from '@/ui/components';
import { ILeverageProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import {
    Address,
    erc20ABI,
    multicall,
    prepareWriteContract,
    readContract,
    writeContract,
} from '@wagmi/core';
import { VeloPoolABI } from 'abis/VeloPool';
import { LendingPoolABI } from 'abis/LendingPool';
import { NETWORKS } from '@/utils';
import { useAccount, useNetwork } from 'wagmi';
import { getAddress } from 'ethers/lib/utils.js';
import { BigNumber, constants } from 'ethers';
import { VariableDebtTokenABI } from 'abis/VariableDebtToken';
import { LeverageControllerABI } from 'abis/LeverageController';
import { parseUnits } from 'ethers/lib/utils.js';

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
    const { closeDialog, openDialog } = useDialogController();
    const {
        view,
        setView,
        isLoading,
        isSuccess,
        error,
        estimatedGasCost,
        isButtonDisabled,
        handleSubmit,
    } = useLeverage({ data, ...modalProps });
    const { chain } = useNetwork();
    console.log('chain', chain);
    if (!data) {
        throw new Error('Cant initialize without data'); // TODO alo
    }

    const { asset, trancheId, collateral, amount, leverage } = data; // TODO alo
    console.log('hereiam', data);
    const { zappableAssets, handleZap } = useZap(asset);
    const { address: wallet } = useAccount();

    const [borrowAllowance, setBorrowAllowance] = useState(BigNumber.from(0));
    const [leverageDetails, setLeverageDetails] = useState<LeverageDetails>();

    const approveBorrowDelegation = async () => {
        if (!leverageDetails || !chain) return; // TODO alo

        const CHAIN_CONFIG = NETWORKS[chain.network];

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
        if (!leverageDetails || !chain || !amount) return; // TODO alo
        const CHAIN_CONFIG = NETWORKS[chain.network];

        const { token0, decimals0, token1, decimals1, stable } = leverageDetails;

        const params = {
            lpToken: getAddress(asset),
            trancheId: BigNumber.from(trancheId),
            token0,
            decimals0,
            token1,
            decimals1,
            stable,
        };
        const totalBorrowAmount = parseUnits(amount.replace('$', ''), 8)
            .mul((leverage * 100).toFixed(0))
            .div(100);
        const isBorrowToken0 = getAddress(collateral) === getAddress(token0);

        console.log('totalborrowamount', totalBorrowAmount.toString());

        const config = await prepareWriteContract({
            address: CHAIN_CONFIG.leverageControllerAddress,
            abi: LeverageControllerABI,
            functionName: 'leverageVeloLpZap',
            args: [params, totalBorrowAmount, isBorrowToken0],
        });

        const data = await writeContract(config);

        await data.wait();
    };

    useEffect(() => {
        if (!chain || !wallet) return;

        const fetchLeverageDetails = async () => {
            const CHAIN_CONFIG = NETWORKS[chain.network];

            const veloPoolContract = {
                address: getAddress(asset),
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
                        args: [getAddress(collateral), BigNumber.from(trancheId)],
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
        };

        fetchLeverageDetails();
    }, [chain, wallet]);
    return (
        <>
            <ModalHeader
                dialog="leverage-asset-dialog"
                tabs={['Leverage']}
                onClick={setView}
                active={view}
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
                                        <button key={`top-supplied-asset-${i}`} onClick={handleZap}>
                                            <PillDisplay type="asset" asset={el.symbol} hoverable />
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
                                APY
                            </span>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-2xl leading-none">{`${
                                (data as any)?.leverage || 0
                            }x`}</span>
                            <span className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                                Leverage
                            </span>
                        </div>
                    </div>

                    <ModalTableDisplay
                        title="APY Breakdown"
                        content={(data as any)?.apyBreakdown || []}
                    />

                    <div className="mt-4">
                        <span>How it works</span>
                        <ol className="list-decimal mx-6">
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ol>
                    </div>

                    <ModalTableDisplay
                        title="Transaction Overview"
                        content={[
                            {
                                label: 'Estimated Gas',
                                value: estimatedGasCost.cost,
                                loading: estimatedGasCost.loading,
                                error: estimatedGasCost.errorMessage,
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
                                `/tranches/${data?.tranche?.toLowerCase().replace(/\s+/g, '-')}`,
                                {
                                    state: { view: 'details', trancheId: data?.trancheId },
                                },
                            );
                        }}
                    />
                )}
                {borrowAllowance.lt(VERY_BIG_ALLOWANCE) && (
                    <Button
                        primary
                        label={'Approve delegation'}
                        onClick={approveBorrowDelegation}
                    />
                )}
                <Button
                    primary
                    disabled={isButtonDisabled()}
                    onClick={leverageVeloZap}
                    label={'Submit Transaction'}
                    loading={isLoading}
                    loadingText="Submitting"
                />
            </ModalFooter>
        </>
    );
};

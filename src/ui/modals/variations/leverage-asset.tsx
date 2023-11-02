import React from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useLeverage, useModal, useZap } from '@/hooks';
import {
    TransactionStatus,
    Button,
    SkeletonLoader,
    PillDisplay,
    AssetDisplay,
    NumberDisplay,
} from '@/ui/components';
import { ISupplyBorrowProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';

export const LeverageAssetDialog: React.FC<ISupplyBorrowProps> = ({ data }) => {
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
        asset,
        estimatedGasCost,
        isButtonDisabled,
        handleSubmit,
    } = useLeverage({ data, ...modalProps });
    const { zappableAssets, handleZap } = useZap(asset);
    console.log('data', data, modalProps);
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
                <Button
                    primary
                    disabled={isButtonDisabled()}
                    onClick={handleSubmit}
                    label={view?.includes('Claim') ? 'Claim Rewards' : 'Submit Transaction'}
                    loading={isLoading}
                    loadingText="Submitting"
                />
            </ModalFooter>
        </>
    );
};

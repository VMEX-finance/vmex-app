import React from 'react';
import {
    HealthFactor,
    Button,
    CoinInput,
    TransactionStatus,
    MessageStatus,
    Tooltip,
} from '@/ui/components';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { ISupplyBorrowProps } from '../utils';
import { useBorrow, useDialogController, useModal } from '@/hooks';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
} from '@/utils';
import { useSelectedTrancheContext } from '@/store';
import { useNavigate } from 'react-router-dom';
import { usePricesData } from 'api/prices';

export const BorrowAssetDialog: React.FC<ISupplyBorrowProps> = ({ name, isOpen, data, tab }) => {
    const modalProps = useModal('borrow-asset-dialog');
    const {
        amountBorrwable,
        amountRepay,
        isViolatingMax,
        isViolatingBorrowCap,
        isViolatingMaxInWallet,
        apy,
        estimatedGasCost,
        handleClick,
        isButtonDisabled,
        maxOnClick,
        view,
        isSuccess,
        amount,
        setAmount,
        setIsMax,
        error,
        isLoading,
        setView,
        toggleEthWeth,
        isEth,
        asset,
    } = useBorrow({ data, ...modalProps });
    const { setAsset } = useSelectedTrancheContext();
    const navigate = useNavigate();
    const { closeDialog } = useDialogController();

    return data && asset ? (
        <>
            <ModalHeader
                dialog="borrow-asset-dialog"
                tabs={['Borrow', 'Repay']}
                onClick={setView}
                active={view}
                disabled={isLoading}
            />
            {view?.includes('Borrow') ? (
                !isSuccess && !error ? (
                    // Default State
                    <>
                        <h3 className="mt-3 2xl:mt-4 text-neutral400">Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: `/coins/${asset?.toLowerCase()}.svg`,
                                name: asset,
                            }}
                            balance={bigNumberToUnformattedString(
                                amountBorrwable.amountNative,
                                asset,
                            )}
                            type="collateral"
                            setIsMax={setIsMax}
                            loading={amountBorrwable.loading}
                            customMaxClick={maxOnClick}
                            disabled={isLoading}
                        />
                        <MessageStatus
                            type="error"
                            show={isViolatingMax()}
                            message="Input amount is over the max"
                        />
                        <MessageStatus
                            type="error"
                            show={isViolatingBorrowCap()}
                            message="Attempting to borrow more than borrow cap"
                        />

                        <h3 className="mt-6 text-neutral400">Health Factor</h3>
                        <HealthFactor
                            asset={asset}
                            amount={amount}
                            type={'borrow'}
                            trancheId={String(data?.trancheId)}
                        />

                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Borrow APR (%)',
                                    value: `${apy}`,
                                },
                                {
                                    label: 'Estimated Gas',
                                    value: estimatedGasCost.cost,
                                    loading: estimatedGasCost.loading,
                                },
                            ]}
                        />
                    </>
                ) : (
                    <div className="mt-8 mb-6">
                        <TransactionStatus success={isSuccess} errorText={error} full />
                    </div>
                )
            ) : !isSuccess && !error ? (
                // Default State
                <>
                    <h3 className="mt-3 2xl:mt-4 text-neutral400">Amount</h3>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            logo: `/coins/${asset?.toLowerCase()}.svg`,
                            name: asset,
                        }}
                        balance={bigNumberToUnformattedString(amountRepay, asset)}
                        type="owed"
                        setIsMax={setIsMax}
                        loading={Number(bigNumberToNative(amountRepay, asset)) === 0}
                        customMaxClick={maxOnClick}
                    />
                    <MessageStatus
                        type="error"
                        show={isViolatingMax()}
                        message="Input amount is over the max"
                    />
                    <MessageStatus
                        type="error"
                        show={isViolatingMaxInWallet()}
                        message="Attempting to repay more than in wallet"
                    />

                    <h3 className="mt-3 2xl:mt-4 text-neutral400">Health Factor</h3>
                    <HealthFactor
                        asset={asset}
                        amount={amount}
                        type={'repay'}
                        trancheId={String(data?.trancheId)}
                    />

                    <ModalTableDisplay
                        title="Transaction Overview"
                        content={[
                            {
                                label: 'Remaining Balance',
                                value: `${
                                    amount
                                        ? bigNumberToNative(
                                              amountRepay.sub(
                                                  unformattedStringToBigNumber(amount, asset),
                                              ),
                                              asset,
                                          )
                                        : bigNumberToNative(amountRepay, asset)
                                } ${asset}`,
                                loading: Number(bigNumberToNative(amountRepay, asset)) === 0,
                            },
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
                    <TransactionStatus success={isSuccess} errorText={error} full />
                </div>
            )}
            <ModalFooter between={!location.hash.includes('tranches')}>
                {!location.hash.includes('tranches') && (
                    <Button
                        label={`View Tranche`}
                        onClick={() => {
                            setAsset(asset);
                            closeDialog('borrow-asset-dialog');
                            window.scroll(0, 0);
                            navigate(
                                `/tranches/${data.tranche?.toLowerCase().replace(/\s+/g, '-')}`,
                                {
                                    state: { view: 'details', trancheId: data.trancheId },
                                },
                            );
                        }}
                    />
                )}
                {Number(amount) === 0 ? (
                    <Tooltip text="Please enter an amount">
                        <Button primary label={'Submit Transaction'} disabled />
                    </Tooltip>
                ) : (
                    <Button
                        primary
                        disabled={isButtonDisabled()}
                        onClick={handleClick}
                        label={'Submit Transaction'}
                        loading={isLoading}
                        loadingText="Submitting"
                    />
                )}
            </ModalFooter>
        </>
    ) : (
        <></>
    );
};

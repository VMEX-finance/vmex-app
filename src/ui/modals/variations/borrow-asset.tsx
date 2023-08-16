import React from 'react';
import {
    HealthFactor,
    Button,
    CoinInput,
    TransactionStatus,
    MessageStatus,
    Tooltip,
} from '../../components';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { ISupplyBorrowProps } from '../utils';
import { useBorrow, useDialogController, useModal } from '../../../hooks';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
} from '../../../utils';
import { useSelectedTrancheContext } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const BorrowAssetDialog: React.FC<ISupplyBorrowProps> = ({ name, isOpen, data, tab }) => {
    const modalProps = useModal('borrow-asset-dialog');
    const {
        amountBorrwable,
        amountRepay,
        isViolatingMax,
        isViolatingBorrowCap,
        apy,
        estimatedGasCost,
        handleClick,
        isButtonDisabled,
        maxOnClick,
        view,
        isSuccess,
        amount,
        setAmount,
        isMax,
        setIsMax,
        error,
        isLoading,
        setView,
    } = useBorrow({ data, ...modalProps });
    const { setAsset } = useSelectedTrancheContext();
    const navigate = useNavigate();
    const { closeDialog } = useDialogController();

    return data && data.asset ? (
        <>
            <ModalHeader
                dialog="borrow-asset-dialog"
                tabs={['Borrow', 'Repay']}
                onClick={setView}
                active={view}
            />
            {view?.includes('Borrow') ? (
                !isSuccess && !error ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-neutral400">Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                name: data.asset,
                            }}
                            balance={bigNumberToUnformattedString(
                                amountBorrwable.amountNative,
                                data.asset,
                            )}
                            type="collateral"
                            isMax={isMax}
                            setIsMax={setIsMax}
                            loading={amountBorrwable.loading}
                            customMaxClick={maxOnClick}
                        />
                        <MessageStatus
                            type="error"
                            show={isViolatingMax()}
                            message="Input amount is over the max"
                        />
                        <MessageStatus
                            type="warning"
                            show={isViolatingBorrowCap()}
                            message="WARNING: Attempting to borrow more than borrow cap"
                        />

                        <h3 className="mt-6 text-neutral400">Health Factor</h3>
                        <HealthFactor
                            asset={data.asset}
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
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} errorText={error} full />
                    </div>
                )
            ) : !isSuccess && !error ? (
                // Default State
                <>
                    <h3 className="mt-5 text-neutral400">Amount</h3>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                            name: data.asset,
                        }}
                        balance={bigNumberToUnformattedString(amountRepay, data.asset)}
                        type="owed"
                        isMax={isMax}
                        setIsMax={setIsMax}
                        loading={Number(bigNumberToNative(amountRepay, data.asset)) === 0}
                        customMaxClick={maxOnClick}
                    />
                    <MessageStatus
                        type="error"
                        show={isViolatingMax()}
                        message="Input amount is over the max"
                    />

                    <h3 className="mt-6 text-neutral400">Health Factor</h3>
                    <HealthFactor
                        asset={data.asset}
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
                                                  unformattedStringToBigNumber(amount, data.asset),
                                              ),
                                              data.asset,
                                          )
                                        : bigNumberToNative(amountRepay, data.asset)
                                } ${data.asset}`,
                                loading: Number(bigNumberToNative(amountRepay, data.asset)) === 0,
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
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} errorText={error} full />
                </div>
            )}
            <ModalFooter between={!location.hash.includes('tranches')}>
                {!location.hash.includes('tranches') && (
                    <Button
                        label={`View Tranche`}
                        onClick={() => {
                            setAsset(data.asset);
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
                    <Tooltip
                        text="Please enter an amount"
                        content={<Button primary label={'Submit Transaction'} disabled />}
                    />
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

import React from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useModal, useSupply } from '../../../hooks';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
} from '../../../utils';
import {
    HealthFactor,
    ActiveStatus,
    TransactionStatus,
    Button,
    CoinInput,
    MessageStatus,
    Tooltip,
    BasicToggle,
    SecondaryButton,
} from '../../components';
import { BigNumber } from 'ethers';
import { ISupplyBorrowProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store';

export const SupplyAssetDialog: React.FC<ISupplyBorrowProps> = ({ data }) => {
    const modalProps = useModal('loan-asset-dialog');
    const navigate = useNavigate();
    const { setAsset } = useSelectedTrancheContext();
    const { closeDialog, openDialog } = useDialogController();
    const {
        amountWalletNative,
        maxOnClick,
        isViolatingMax,
        isViolatingSupplyCap,
        collateral,
        existingSupplyCollateral,
        setExistingSupplyCollateral,
        asCollateral,
        setAsCollateral,
        apy,
        renderRewards,
        estimatedGasCost,
        queryUserRewardsData,
        amountWithdraw,
        handleSubmit,
        view,
        setView,
        isSuccess,
        error,
        amount,
        setAmount,
        isMax,
        setIsMax,
        isLoading,
        isButtonDisabled,
        toggleEthWeth,
        isEth,
        asset,
    } = useSupply({ data, ...modalProps });

    return (
        <>
            <ModalHeader
                dialog="loan-asset-dialog"
                tabs={['Supply', 'Withdraw', 'Claim']}
                onClick={setView}
                active={view}
            />
            {view?.includes('Supply') ? (
                !isSuccess && !error ? (
                    // Default State
                    <>
                        <div className="mt-5 flex justify-between items-center">
                            <h3>Amount</h3>
                            {/* TODO: uncomment when ETH is ready */}
                            {/* {data?.asset?.toLowerCase() === 'weth' && (
                                <SecondaryButton className="p-1" onClick={toggleEthWeth}>
                                    Use {isEth ? 'WETH' : 'ETH'}
                                </SecondaryButton>
                            )} */}
                        </div>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: `/coins/${asset?.toLowerCase() || 'eth'}.svg`,
                                name: asset || 'ETH',
                            }}
                            balance={bigNumberToUnformattedString(
                                amountWalletNative.amountNative,
                                asset || 'eth',
                            )}
                            isMax={isMax}
                            setIsMax={setIsMax}
                            loading={amountWalletNative.loading}
                            customMaxClick={maxOnClick}
                        />
                        <MessageStatus
                            type="error"
                            show={isViolatingMax()}
                            message="Input amount is over the max"
                        />
                        <MessageStatus
                            type="warning"
                            show={isViolatingSupplyCap()}
                            message="WARNING: Attempting to supply more than the supply cap"
                        />

                        <h3 className="mt-6">Collaterize</h3>
                        <div className="mt-1">
                            {typeof collateral === 'boolean' ? (
                                <Tooltip
                                    text={`Your previous supply is ${
                                        collateral === false ? 'not' : ''
                                    } collateralized.`}
                                    content={
                                        <BasicToggle
                                            checked={existingSupplyCollateral}
                                            disabled={!data?.collateral}
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                openDialog('toggle-collateral-dialog', {
                                                    ...data,
                                                    collateral: collateral,
                                                    setCollateral: setExistingSupplyCollateral,
                                                });
                                                e.stopPropagation();
                                            }}
                                        />
                                    }
                                />
                            ) : (
                                <BasicToggle
                                    checked={asCollateral}
                                    onChange={() => setAsCollateral(!asCollateral)}
                                    disabled={!data?.collateral}
                                />
                            )}
                        </div>

                        <h3 className="mt-6 text-neutral400">Health Factor</h3>
                        <HealthFactor
                            asset={data?.asset || 'ETH'}
                            amount={amount}
                            type={'supply'}
                            trancheId={String(data?.trancheId)}
                        />

                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Supply APR',
                                    value: `${apy || '0.00%'}`,
                                },
                                {
                                    label: 'Collateralization',
                                    value: <ActiveStatus active={asCollateral} size="sm" />,
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
            ) : view?.includes('Claim') ? (
                <>
                    <ModalTableDisplay
                        title="Rewards"
                        content={renderRewards()}
                        noData={{
                            text: 'No Rewards Available',
                        }}
                        loading={queryUserRewardsData.isLoading}
                    />
                </>
            ) : !isSuccess && !error ? (
                // Default State
                <>
                    <div className="mt-5 flex justify-between items-center">
                        <h3>Amount</h3>
                        {/* TODO: uncomment when ETH wrapping ready */}
                        {/* {data?.asset?.toLowerCase() === 'weth' && (
                            <SecondaryButton className="p-1" onClick={toggleEthWeth}>
                                Use ETH
                            </SecondaryButton>
                        )} */}
                    </div>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            logo: `/coins/${asset?.toLowerCase() || 'eth'}.svg`,
                            name: asset || 'ETH',
                        }}
                        balance={bigNumberToUnformattedString(
                            amountWithdraw || BigNumber.from('0'),
                            asset || 'ETH',
                        )}
                        isMax={isMax}
                        setIsMax={setIsMax}
                        loading={Number(bigNumberToNative(amountWithdraw, asset || 'ETH')) === 0}
                        customMaxClick={maxOnClick}
                    />
                    <MessageStatus
                        type="error"
                        show={isViolatingMax()}
                        message="Input amount is over the max"
                    />

                    <h3 className="mt-6 text-neutral400">Health Factor</h3>
                    <HealthFactor
                        asset={data?.asset || 'ETH'}
                        amount={amount}
                        type={'withdraw'}
                        trancheId={String(data?.trancheId)}
                    />

                    <ModalTableDisplay
                        title="Transaction Overview"
                        content={[
                            {
                                label: 'Remaining Supply',
                                value:
                                    amount && amountWithdraw
                                        ? bigNumberToNative(
                                              amountWithdraw.sub(
                                                  unformattedStringToBigNumber(
                                                      amount,
                                                      data?.asset || 'ETH',
                                                  ),
                                              ),
                                              data?.asset || 'ETH',
                                          )
                                        : bigNumberToNative(amountWithdraw, data?.asset || 'ETH'),
                                loading:
                                    Number(
                                        bigNumberToNative(amountWithdraw, data?.asset || 'ETH'),
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
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus full success={isSuccess} errorText={error} />
                </div>
            )}

            <ModalFooter between={!location.hash.includes('tranches')}>
                {!location.hash.includes('tranches') && (
                    <Button
                        label={`View Tranche`}
                        onClick={() => {
                            setAsset(data?.asset);
                            closeDialog('loan-asset-dialog');
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
                {Number(amount) === 0 && !view?.includes('Claim') ? (
                    <Tooltip
                        text="Please enter an amount"
                        content={<Button primary label={'Submit Transaction'} disabled />}
                    />
                ) : (
                    <Button
                        primary
                        disabled={isButtonDisabled()}
                        onClick={handleSubmit}
                        label={view?.includes('Claim') ? 'Claim Rewards' : 'Submit Transaction'}
                        loading={isLoading}
                        loadingText="Submitting"
                    />
                )}
            </ModalFooter>
        </>
    );
};

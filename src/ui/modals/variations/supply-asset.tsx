import React, { useState } from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useModal, useSupply } from '@/hooks';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
} from '@/utils';
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
    DefaultAccordion,
    DefaultInput,
    SmartPrice,
} from '@/ui/components';
import { BigNumber } from 'ethers';
import { ISupplyBorrowProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';

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
        referralAddress,
        setReferralAddress,
    } = useSupply({ data, ...modalProps });

    return (
        <>
            <ModalHeader
                dialog="loan-asset-dialog"
                tabs={['Supply', 'Withdraw', 'Zap']}
                onClick={setView}
                active={view}
                disabled={isLoading}
            />
            {view?.includes('Supply') ? (
                !isSuccess && !error ? (
                    // Default State
                    <>
                        <div className="mt-3 2xl:mt-4 flex justify-between items-center">
                            <h3>Amount</h3>
                            {/* TODO: uncomment when ETH is ready */}
                            {asset?.toLowerCase() === 'weth' ||
                                (asset?.toLowerCase() === 'eth' && (
                                    <SecondaryButton className="p-1" onClick={toggleEthWeth}>
                                        Use {isEth ? 'WETH' : 'ETH'}
                                    </SecondaryButton>
                                ))}
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
                            disabled={isLoading}
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

                        <h3 className="mt-3 2xl:mt-4">Collaterize</h3>
                        <div className="mt-1">
                            {typeof collateral === 'boolean' ? (
                                <Tooltip
                                    text={`Your previous supply is ${
                                        collateral === false ? 'not' : ''
                                    } collateralized.`}
                                    position="right"
                                >
                                    <BasicToggle
                                        checked={existingSupplyCollateral}
                                        disabled={!data?.collateral || isLoading}
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            openDialog('toggle-collateral-dialog', {
                                                ...data,
                                                collateral: collateral,
                                                setCollateral: setExistingSupplyCollateral,
                                                amountNative: amountWithdraw,
                                            });
                                            e.stopPropagation();
                                        }}
                                    />
                                </Tooltip>
                            ) : (
                                <BasicToggle
                                    checked={asCollateral}
                                    onChange={() => setAsCollateral(!asCollateral)}
                                    disabled={!data?.collateral || isLoading}
                                />
                            )}
                        </div>

                        <h3 className="mt-4 text-neutral400">Health Factor</h3>
                        <HealthFactor
                            asset={asset || 'ETH'}
                            amount={amount}
                            type={'supply'}
                            trancheId={String(data?.trancheId)}
                            withChange={asCollateral}
                        />

                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Supply APR',
                                    value: (
                                        <span className="flex items-center">
                                            <SmartPrice price={String(apy) || '0.00'} />%
                                        </span>
                                    ),
                                },
                                {
                                    label: 'Collateralization',
                                    value: (
                                        <ActiveStatus
                                            active={
                                                typeof collateral === 'boolean'
                                                    ? existingSupplyCollateral
                                                    : asCollateral
                                            }
                                            size="sm"
                                        />
                                    ),
                                },
                                {
                                    label: 'Estimated Gas',
                                    value: estimatedGasCost.cost,
                                    loading: estimatedGasCost.loading,
                                    error: estimatedGasCost.errorMessage,
                                },
                            ]}
                        />

                        <DefaultAccordion
                            noIcon
                            wrapperClass="!border-0"
                            customHover="hover:!text-brand-purple"
                            className="!px-0 !hover:!bg-inherit !bg-white dark:!bg-brand-black"
                            title={`referral-code`}
                            summary={<span>Did someone refer you?</span>}
                            details={
                                <div className="px-2">
                                    <DefaultInput
                                        value={referralAddress}
                                        onType={(e: string) => setReferralAddress(e)}
                                        size="lg"
                                        placeholder="Paste address here"
                                        required
                                        className="flex w-full flex-col py-2"
                                    />
                                </div>
                            }
                        />
                    </>
                ) : (
                    <div className="mt-8 mb-6">
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
                    <div className="mt-4 flex justify-between items-center">
                        <h3>Amount</h3>
                        {/* TODO: uncomment when ETH wrapping ready */}
                        {/* {asset?.toLowerCase() === 'weth' && (
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

                    <h3 className="mt-3 2xl:mt-4 text-neutral400">Health Factor</h3>
                    <HealthFactor
                        asset={asset || 'ETH'}
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
                                                      asset || 'ETH',
                                                  ),
                                              ),
                                              asset || 'ETH',
                                          )
                                        : bigNumberToNative(amountWithdraw, asset || 'ETH'),
                                loading:
                                    Number(bigNumberToNative(amountWithdraw, asset || 'ETH')) === 0,
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
                    <TransactionStatus full success={isSuccess} errorText={error} />
                </div>
            )}

            <ModalFooter between={!location.hash.includes('tranches')}>
                {!location.hash.includes('tranches') && (
                    <Button
                        label={`View Tranche`}
                        onClick={() => {
                            setAsset(asset);
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
                    <Tooltip text="Please enter an amount">
                        <Button primary label={'Submit Transaction'} disabled />
                    </Tooltip>
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

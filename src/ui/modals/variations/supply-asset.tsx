import React, { useEffect, useState } from 'react';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useModal, useSupply, useZap } from '@/hooks';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
    getNetworkName,
    redirectToPool,
    hardcodedTrancheNames,
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
    DefaultAccordion,
    DefaultInput,
    SmartPrice,
    Loader,
    PillDisplay,
} from '@/ui/components';
import { BigNumber } from 'ethers';
import { ISupplyBorrowProps } from '../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { usePricesData } from '@/api';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { convertSymbolToAddress } from '@vmexfinance/sdk';

export const SupplyAssetDialog: React.FC<ISupplyBorrowProps> = ({ data }) => {
    const modalProps = useModal('loan-asset-dialog');
    const navigate = useNavigate();
    const { setAsset } = useSelectedTrancheContext();
    const { closeDialog, openDialog } = useDialogController();
    const { errorAssets } = usePricesData();
    const networkName = getNetworkName();
    const location = useLocation();
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
    const {
        zappableAssets,
        handleZap,
        setIsMaxZap,
        setZapAmount,
        zapAmount,
        zapBalance,
        zapAsset,
        submitZap,
        getZapOutput,
    } = useZap(asset, (data as any)?.zapAsset, (data as any)?.zappableAssets);

    const poolLink = redirectToPool(convertSymbolToAddress(asset, networkName));

    // Clear router state after success
    useEffect(() => {
        if (isSuccess && window && document && location.state?.from === 'gauges') {
            const timeout = setTimeout(() => {
                navigate('/staking', {
                    state: {
                        from: 'tranche-details',
                        data,
                        action: 'stake',
                    },
                });
                window.history.replaceState({}, document.title);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [isSuccess]);

    return (
        <>
            <ModalHeader
                dialog="loan-asset-dialog"
                tabs={['Supply', 'Withdraw']}
                onClick={setView}
                active={view}
                disabled={isLoading}
            />
            {view?.includes('Supply') ? (
                !isSuccess && !error ? (
                    // Default State
                    <>
                        {zappableAssets.length !== 0 && (
                            <>
                                <div className="mt-3 2xl:mt-4 flex justify-between items-center">
                                    <h3>Zap</h3>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <Accordion
                                        className="w-full"
                                        TransitionProps={{ unmountOnExit: true }}
                                        expanded={!!zapAsset.address}
                                        disableGutters
                                        sx={{ boxShadow: 'none' }}
                                    >
                                        <AccordionSummary
                                            className="!cursor-default"
                                            classes={{ content: 'margin: 0 !important;' }}
                                            sx={{ minHeight: 'auto', padding: '0px' }}
                                        >
                                            <div className="flex items-center gap-1">
                                                {isLoading ? (
                                                    <Loader
                                                        variant="rounded"
                                                        className="!rounded-3xl"
                                                        type="skeleton"
                                                    >
                                                        <PillDisplay
                                                            type="asset"
                                                            asset={'BTC'}
                                                            value={0}
                                                        />
                                                    </Loader>
                                                ) : (
                                                    zappableAssets.map((el, i) => (
                                                        <button
                                                            key={`top-supplied-asset-${i}`}
                                                            onClick={(e) =>
                                                                el.amount === '$0.00'
                                                                    ? {}
                                                                    : handleZap(e, el)
                                                            }
                                                            disabled={el.amount === '$0.00'}
                                                        >
                                                            <PillDisplay
                                                                type="asset"
                                                                asset={el.symbol}
                                                                hoverable={el.amount !== '$0.00'}
                                                                selected={
                                                                    el.address?.toLowerCase() ===
                                                                    zapAsset?.address.toLowerCase()
                                                                }
                                                            />
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="flex flex-col gap-1.5 items-end">
                                                <CoinInput
                                                    amount={zapAmount}
                                                    setAmount={setZapAmount}
                                                    coin={{
                                                        name: zapAsset.symbol,
                                                    }}
                                                    setIsMax={setIsMaxZap}
                                                    balance={zapBalance}
                                                />
                                                <div className="flex justify-between items-start pl-1 w-full">
                                                    <p className="text-sm flex items-center gap-0.5">
                                                        Output amount: <SmartPrice price={''} />
                                                    </p>
                                                    <Button
                                                        onClick={submitZap}
                                                        className="w-fit"
                                                        type="accent"
                                                        disabled={zapBalance === '0'}
                                                    >
                                                        {zapBalance === '0'
                                                            ? `Insufficient ${zapAsset.symbol}`
                                                            : `Zap to ${asset ? asset : ''}`}
                                                    </Button>
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </>
                        )}
                        <div
                            className={`${
                                zapAsset.address
                                    ? ' blur-[1px] relative z-[99] opacity-80 pointer-events-none'
                                    : ''
                            }`}
                        >
                            <div className="mt-3 2xl:mt-4 flex justify-between items-center">
                                <h3>Amount</h3>
                                {asset?.toLowerCase() === 'weth' ||
                                    (asset?.toLowerCase() === 'eth' && (
                                        <Button className="p-1" onClick={toggleEthWeth} type="link">
                                            Use {isEth ? 'WETH' : 'ETH'}
                                        </Button>
                                    ))}
                            </div>
                            <CoinInput
                                amount={amount}
                                setAmount={setAmount}
                                coin={{
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
                                message="Input amount is over the max."
                                icon
                            />
                            <></>
                            <MessageStatus
                                type="warning"
                                show={!amount ? false : isViolatingSupplyCap()}
                                message="Attempting to supply more than the supply cap. Proceed with caution."
                                icon
                            />
                            <MessageStatus
                                type="error"
                                show={errorAssets?.includes(asset.toUpperCase())}
                                message="Error getting an oracle price for this asset. Please try again later."
                                icon
                            />

                            <h3 className="mt-3 2xl:mt-4">Collaterize</h3>
                            <div>
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

                            <h3 className="mt-3 2xl:mt-4 text-neutral400">Health Factor</h3>
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
                        </div>
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
                        {asset?.toLowerCase() === 'weth' ||
                            (asset?.toLowerCase() === 'eth' && (
                                <Button className="p-1" onClick={toggleEthWeth} type="link">
                                    Use {isEth ? 'WETH' : 'ETH'}
                                </Button>
                            ))}
                    </div>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
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
                        message="Input amount is over the max."
                        icon
                    />
                    <MessageStatus
                        type="error"
                        show={errorAssets?.includes(asset.toUpperCase())}
                        message="Error getting an oracle price for this asset. Please try again later."
                        icon
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

            <div
                className={`${
                    zapAsset.address
                        ? ' blur-[1px] relative z-[99] opacity-80 pointer-events-none'
                        : ''
                }`}
            >
                <ModalFooter between={!location.hash.includes('tranches') || !!poolLink}>
                    {!location.hash.includes('tranches') ? (
                        <Button
                            type="outline"
                            onClick={() => {
                                setAsset(asset);
                                closeDialog('loan-asset-dialog');
                                window.scroll(0, 0);
                                navigate(
                                    `/tranches/${hardcodedTrancheNames(data?.tranche || '')
                                        ?.toLowerCase()
                                        .replace(/\s+/g, '-')}`,
                                    {
                                        state: { view: 'details', trancheId: data?.trancheId },
                                    },
                                );
                            }}
                        >
                            View Tranche
                        </Button>
                    ) : poolLink ? (
                        <a
                            href={poolLink}
                            target="_blank"
                            rel="noreferrer"
                            className="!no-underline"
                        >
                            <Button type="outline" className="text-black">
                                View Pool
                            </Button>
                        </a>
                    ) : (
                        <></>
                    )}

                    {Number(amount) === 0 && !view?.includes('Claim') ? (
                        <Tooltip text="Please enter an amount">
                            <Button type="accent" disabled>
                                Submit Transaction
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button
                            type="accent"
                            disabled={
                                isButtonDisabled() || errorAssets?.includes(asset.toUpperCase())
                            }
                            onClick={handleSubmit as any}
                            loading={isLoading}
                            loadingText="Submitting"
                        >
                            {view?.includes('Claim') ? 'Claim Rewards' : 'Submit Transaction'}
                        </Button>
                    )}
                </ModalFooter>
            </div>
        </>
    );
};

import React, { useEffect } from 'react';
import {
    HealthFactor,
    Button,
    CoinInput,
    TransactionStatus,
    MessageStatus,
    Tooltip,
} from '../../components';
import { ModalFooter, ModalHeaderV2, ModalTableDisplay } from '../subcomponents';
import { ISupplyBorrowProps } from '../utils';
import { useDialogController, useModal } from '../../../hooks';
import { borrow, estimateGas, repay } from '@vmexfinance/sdk';
import {
    NETWORK,
    convertStringFormatToNumber,
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
    SDK_PARAMS,
    DECIMALS,
    bigNumberToUSD,
} from '../../../utils';
import { useAccount, useSigner } from 'wagmi';
import { useUserTrancheData, useSubgraphTrancheData } from '../../../api';
import { BigNumber, utils, Wallet } from 'ethers';
import { useSelectedTrancheContext } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const BorrowAssetDialog: React.FC<ISupplyBorrowProps> = ({ name, isOpen, data, tab }) => {
    const {
        isSuccess,
        submitTx,
        isLoading,
        error,
        amount,
        setAmount,
        isMax,
        setIsMax,
        view,
        setView,
    } = useModal('borrow-asset-dialog');
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { findAssetInUserSuppliesOrBorrows, findAmountBorrowable } = useUserTrancheData(
        address,
        data?.trancheId || 0,
    );
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { setAsset } = useSelectedTrancheContext();
    const navigate = useNavigate();
    const { closeDialog } = useDialogController();
    const [estimatedGasCost, setEstimatedGasCost] = React.useState('0');

    const defaultFunctionParams = {
        trancheId: data ? data.trancheId : 0,
        amount: convertStringFormatToNumber(amount),
        signer: signer
            ? signer
            : new Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'),
        network: NETWORK,
        isMax: isMax,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    };

    const handleClick = async () => {
        if (data && signer) {
            await submitTx(async () => {
                const res = view?.includes('Borrow')
                    ? await borrow({
                          ...defaultFunctionParams,
                          underlying: data.asset,
                          //   interestRateMode: 2,
                          // referrer: number,
                          // collateral: boolean,
                      })
                    : await repay({
                          ...defaultFunctionParams,
                          asset: data.asset,
                          //   rateMode: 2,
                          // referrer: number,
                          // collateral: boolean,
                      });
                return res;
            });
        }
    };

    const amountBorrwable = findAmountBorrowable(
        data?.asset || '',
        findAssetInMarketsData(data?.asset || '')?.liquidity,
        findAssetInMarketsData(data?.asset || '')?.decimals,
        findAssetInMarketsData(data?.asset || '')?.priceUSD,
    );
    const apy = findAssetInMarketsData(data?.asset || '')?.borrowRate;
    const amountRepay =
        findAssetInUserSuppliesOrBorrows(data?.asset, 'borrow')?.amountNative ||
        data?.amountNative ||
        BigNumber.from('0');

    const maxOnClick = () => {
        setAmount(
            view?.includes('Borrow')
                ? bigNumberToUnformattedString(amountBorrwable.amountNative, data?.asset || '')
                : bigNumberToUnformattedString(amountRepay, data?.asset || ''),
        );
        setIsMax(true);
    };

    const isViolatingBorrowCap = function () {
        if (!amount || !view?.includes('Borrow')) return false;
        const borrowCap = Number(findAssetInMarketsData(data?.asset || '')?.borrowCap);
        const currentBorrowed = Number(findAssetInMarketsData(data?.asset || '')?.totalBorrowed); //already considers decimals
        const newTotalBorrow = Number(amount) + currentBorrowed;

        if (newTotalBorrow > borrowCap) {
            return true;
        }
        return false;
    };

    const isViolatingMax = () => {
        if (data?.asset && amount) {
            if (
                amount.includes('.') &&
                amount.split('.')[1].length > (DECIMALS.get(data.asset) || 18)
            ) {
                return true;
            } else {
                const inputAmount = utils.parseUnits(amount, DECIMALS.get(data.asset));
                return inputAmount.gt(
                    view?.includes('Borrow') ? amountBorrwable.amountNative : amountRepay,
                );
            }
        }
        return false;
    };

    useEffect(() => {
        if (data?.view) setView('Repay');
    }, [data?.view]);

    useEffect(() => {
        const getter = async () => {
            if (signer && data) {
                const res = view?.includes('Borrow')
                    ? await estimateGas({
                          ...defaultFunctionParams,
                          function: 'borrow',
                          underlying: data.asset,
                      })
                    : await estimateGas({
                          ...defaultFunctionParams,
                          function: 'repay',
                          asset: data.asset,
                      });
                setEstimatedGasCost(bigNumberToUSD(res, DECIMALS.get(data.asset) || 18));
            }
        };
        getter();
    }, [view, data, isMax, amount, signer]);

    return data && data.asset ? (
        <>
            <ModalHeaderV2
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
                                    value: `${estimatedGasCost}`,
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
                                value: `${estimatedGasCost}`,
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
                        disabled={
                            isSuccess ||
                            error.length !== 0 ||
                            (!amount && !isMax) ||
                            (view?.includes('Borrow') && amountBorrwable.amountNative.lt(10)) ||
                            (view?.includes('Repay') && amountRepay.lt(10)) ||
                            isViolatingBorrowCap() ||
                            isViolatingMax()
                        }
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

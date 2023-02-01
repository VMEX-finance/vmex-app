import React, { useEffect, useState } from 'react';
import { useMediatedState } from 'react-use';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useDialogController, useModal } from '../../../hooks';
import { supply, withdraw } from '@vmexfinance/sdk';
import {
    NETWORK,
    inputMediator,
    convertStringFormatToNumber,
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
    SDK_PARAMS,
    DECIMALS,
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
} from '../../components';
import { useSubgraphTrancheData, useUserData, useUserTrancheData } from '../../../api';
import { useSigner, useAccount } from 'wagmi';
import { BigNumber, utils } from 'ethers';
import { IYourSuppliesTableItemProps } from '@ui/tables';
import { ISupplyBorrowProps } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store';

export const SupplyAssetDialog: React.FC<ISupplyBorrowProps> = ({ name, isOpen, data, tab }) => {
    const { submitTx, isSuccess, error, isLoading } = useModal('loan-asset-dialog');
    const [view, setView] = React.useState('Supply');
    const [isMax, setIsMax] = React.useState(false);
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const { findAssetInUserSuppliesOrBorrows } = useUserTrancheData(address, data?.trancheId || 0);
    const { getTokenBalance } = useUserData(address);
    const navigate = useNavigate();
    const { setAsset } = useSelectedTrancheContext();
    const { closeDialog } = useDialogController();
    const [asCollateral, setAsCollateral] = useState<any>(data?.collateral);

    const handleSubmit = async () => {
        if (signer && data) {
            await submitTx(async () => {
                const res = view?.includes('Supply')
                    ? await supply({
                          underlying: data.asset,
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          signer: signer,
                          network: NETWORK,
                          isMax: isMax,
                          test: SDK_PARAMS.test,
                          providerRpc: SDK_PARAMS.providerRpc,
                          collateral: asCollateral,
                          // referrer: number,
                          // collateral: boolean,
                      })
                    : await withdraw({
                          asset: data.asset,
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          signer: signer,
                          network: NETWORK,
                          interestRateMode: 2,
                          isMax: isMax,
                          test: SDK_PARAMS.test,
                          providerRpc: SDK_PARAMS.providerRpc,
                          // referrer: number,
                          //   collateral: boolean,
                          // test: boolean
                      });
                return res;
            });
        }
    };

    const amountWalletNative = getTokenBalance(data?.asset || '');
    const apy = findAssetInMarketsData(data?.asset || '')?.supplyRate;
    const amountWithdraw =
        findAssetInUserSuppliesOrBorrows(data?.asset, 'supply')?.amountNative || data?.amountNative;
    const collateral = (
        findAssetInUserSuppliesOrBorrows(data?.asset || '', 'supply') as IYourSuppliesTableItemProps
    )?.collateral;

    const maxOnClick = () => {
        setAmount(
            view?.includes('Supply')
                ? bigNumberToUnformattedString(amountWalletNative.amountNative, data?.asset || '')
                : bigNumberToUnformattedString(amountWithdraw, data?.asset || ''),
        );
        setIsMax(true);
    };

    const isViolatingSupplyCap = function () {
        if (!amount || !view?.includes('Supply')) return false;
        const supplyCap = Number(findAssetInMarketsData(data?.asset || '')?.supplyCap);
        const currentSupplied = Number(findAssetInMarketsData(data?.asset || '')?.totalSupplied); //already considers decimals
        const newTotalSupply = Number(amount) + currentSupplied;
        if (newTotalSupply > supplyCap) {
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
                    view?.includes('Supply')
                        ? amountWalletNative.amountNative
                        : amountWithdraw || BigNumber.from('0'),
                );
            }
        }
        return false;
    };

    useEffect(() => {
        if (data?.view) setView('Withdraw');
    }, [data?.view]);

    return data && data.asset ? (
        <>
            {view?.includes('Supply') ? (
                <>
                    <ModalHeader
                        dialog="loan-asset-dialog"
                        title={name}
                        asset={data.asset}
                        tab={tab}
                        onClick={amountWithdraw ? setView : () => {}}
                        primary
                    />
                    {!isSuccess && !error ? (
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
                                    amountWalletNative.amountNative,
                                    data.asset,
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
                                        } collateralized. If you want to change this, go to the Overview or Portfolio page.`}
                                        content={
                                            <BasicToggle checked={collateral} disabled={true} />
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
                            <HealthFactor asset={data.asset} amount={amount} type={'supply'} />

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={[
                                    {
                                        label: 'Supply APR',
                                        value: `${apy || '0.00%'}`,
                                    },
                                    {
                                        label: 'Collateralization',
                                        value: <ActiveStatus active={collateral} size="sm" />,
                                    },
                                ]}
                            />
                        </>
                    ) : (
                        <div className="mt-10 mb-8">
                            <TransactionStatus success={isSuccess} full />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <ModalHeader
                        dialog="loan-asset-dialog"
                        title={name}
                        asset={data.asset}
                        tab={tab}
                        onClick={data?.view ? () => {} : setView}
                    />
                    {!isSuccess && !error ? (
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
                                    amountWithdraw || BigNumber.from('0'),
                                    data.asset,
                                )}
                                isMax={isMax}
                                setIsMax={setIsMax}
                                loading={
                                    Number(bigNumberToNative(amountWithdraw, data.asset)) === 0
                                }
                                customMaxClick={maxOnClick}
                            />
                            <MessageStatus
                                type="error"
                                show={isViolatingMax()}
                                message="Input amount is over the max"
                            />

                            <h3 className="mt-6 text-neutral400">Health Factor</h3>
                            <HealthFactor asset={data.asset} amount={amount} type={'withdraw'} />

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
                                                              data.asset,
                                                          ),
                                                      ),
                                                      data.asset,
                                                  )
                                                : bigNumberToNative(amountWithdraw, data.asset),
                                        loading:
                                            Number(
                                                bigNumberToNative(amountWithdraw, data.asset),
                                            ) === 0,
                                    },
                                ]}
                            />
                        </>
                    ) : (
                        <div className="mt-10 mb-8">
                            <TransactionStatus full success={isSuccess} />
                        </div>
                    )}
                </>
            )}

            <ModalFooter between={!location.hash.includes('tranches')}>
                {!location.hash.includes('tranches') && (
                    <Button
                        label={`View Tranche`}
                        onClick={() => {
                            setAsset(data.asset);
                            closeDialog('loan-asset-dialog');
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
                            (view?.includes('Supply') && amountWalletNative.amountNative.lt(10)) ||
                            (view?.includes('Withdraw') &&
                                (!amountWithdraw || amountWithdraw.lt(10))) ||
                            isViolatingSupplyCap() ||
                            isViolatingMax()
                        }
                        onClick={handleSubmit}
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

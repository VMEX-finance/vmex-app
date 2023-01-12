import React, { useEffect } from 'react';
import { useMediatedState } from 'react-use';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal } from '../../../hooks';
import { supply, withdraw } from '@vmexfinance/sdk';
import {
    MAINNET_ASSET_MAPPINGS,
    NETWORK,
    inputMediator,
    convertStringFormatToNumber,
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
    SDK_PARAMS,
} from '../../../utils';
import { HealthFactor, ActiveStatus, TransactionStatus, Button, CoinInput } from '../../components';
import { useSubgraphTrancheData, useUserData, useUserTrancheData } from '../../../api';
import { useSigner, useAccount } from 'wagmi';
import { BigNumber } from 'ethers';
import { IYourSuppliesTableItemProps } from '@ui/tables';
import { ISupplyBorrowProps } from '../utils';
import { useQueryClient } from '@tanstack/react-query';
import { BasicToggle } from '../../components/toggles';

export const SupplyAssetDialog: React.FC<ISupplyBorrowProps> = ({ name, isOpen, data, tab }) => {
    const { submitTx, isSuccess, error, isLoading } = useModal('loan-asset-dialog');
    const [view, setView] = React.useState('Supply');
    const [isMax, setIsMax] = React.useState(false);
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const { invalidateQueries } = useQueryClient();
    const { findAssetInMarketsData } = useSubgraphTrancheData(data?.trancheId || 0);
    const { data: signer } = useSigner();
    const { address } = useAccount();
    const { findAssetInUserSuppliesOrBorrows, queryUserTrancheData } = useUserTrancheData(
        address,
        data?.trancheId || 0,
    );
    const { getTokenBalance } = useUserData(address);

    const handleSubmit = async () => {
        if (signer && data) {
            await submitTx(async () => {
                console.log('underlying: ', MAINNET_ASSET_MAPPINGS.get(data.asset) || '');
                console.log('trancheId: ', data.trancheId);
                console.log('amount: ', convertStringFormatToNumber(amount));
                const res = view?.includes('Supply')
                    ? await supply({
                          underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          signer: signer,
                          network: NETWORK,
                          isMax: isMax,
                          test: SDK_PARAMS.test,
                          providerRpc: SDK_PARAMS.providerRpc,
                          // collateral: asCollateral,
                          // referrer: number,
                          // collateral: boolean,
                      })
                    : await withdraw({
                          asset: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          signer: signer,
                          network: NETWORK,
                          interestRateMode: 2,
                          isMax: isMax,
                          test: SDK_PARAMS.test,
                          providerRpc: SDK_PARAMS.providerRpc,
                          // referrer: number,
                          // collateral: boolean,
                          // test: boolean
                      });
                invalidateQueries(['user-tranche']);
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
                            />

                            <h3 className="mt-6 text-neutral400">{view} Max</h3>
                            <div className="mt-1">
                                <BasicToggle checked={isMax} onChange={() => setIsMax(!isMax)} />
                            </div>

                            <h3 className="mt-6 text-neutral400">Health Factor</h3>
                            <HealthFactor asset={data.asset} amount={amount} type={'supply'} />

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={[
                                    {
                                        label: 'Supply APR (%)',
                                        value: `${apy}`,
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
                            />

                            <h3 className="mt-6 text-neutral400">{view} Max</h3>
                            <div className="mt-1">
                                <BasicToggle checked={isMax} onChange={() => setIsMax(!isMax)} />
                            </div>
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
                            <TransactionStatus success={isSuccess} full />
                        </div>
                    )}
                </>
            )}
            <ModalFooter>
                <Button
                    primary
                    disabled={
                        isSuccess ||
                        error.length !== 0 ||
                        !amount ||
                        (view?.includes('Supply') && amountWalletNative.amountNative.lt(10)) ||
                        !amountWithdraw ||
                        (view?.includes('Withdraw') && amountWithdraw.lt(10))
                    }
                    onClick={handleSubmit}
                    label={'Submit Transaction'}
                    loading={isLoading}
                />
            </ModalFooter>
        </>
    ) : (
        <></>
    );
};

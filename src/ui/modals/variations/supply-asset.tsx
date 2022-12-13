import React, { useEffect } from 'react';
import { useMediatedState } from 'react-use';
import { inputMediator, convertStringFormatToNumber } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal } from '../../../hooks/ui';
import { supply, withdraw } from '@vmex/sdk';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';
import { HealthFactor } from '../../components/displays';
import { useTrancheMarketsData } from '../../../api';
import { useSigner, useAccount } from 'wagmi';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
} from '../../../utils/sdk-helpers';
import { useUserData, useUserTrancheData } from '../../../api';
import { BigNumber } from 'ethers';
import { IYourSuppliesTableItemProps } from '@ui/tables';
import { ISupplyBorrowProps } from '../utils';

export const SupplyAssetDialog: React.FC<ISupplyBorrowProps> = ({ name, isOpen, data, tab }) => {
    const { submitTx, isSuccess, error, isLoading } = useModal('loan-asset-dialog');
    const [view, setView] = React.useState('Supply');
    // const [asCollateral, setAsCollateral] = React.useState(true);
    const [isMax, setIsMax] = React.useState(false);
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const { getTrancheMarket } = useTrancheMarketsData(data?.trancheId || 0);
    const { data: signer } = useSigner();
    const { address } = useAccount();

    const { findAssetInUserSuppliesOrBorrows } = useUserTrancheData(address, data?.trancheId || 0);
    const { getTokenBalance } = useUserData(address);

    const handleSubmit = async () => {
        if (signer && data) {
            await submitTx(async () => {
                const res = view?.includes('Supply')
                    ? await supply({
                          underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          signer: signer,
                          network: NETWORK,
                          //   collateral: asCollateral,
                          // referrer: number,
                          // collateral: boolean,
                          // test: boolean
                      })
                    : await withdraw({
                          asset: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          signer: signer,
                          network: NETWORK,
                          interestRateMode: 2,
                          isMax: isMax,
                          // referrer: number,
                          // collateral: boolean,
                          // test: boolean
                      });
                return res;
            });
        }
    };

    const amountWalletNative = getTokenBalance(data?.asset || '').amountNative;
    const apy = getTrancheMarket(data?.asset || '').borrowApy;
    const amountWithdraw = findAssetInUserSuppliesOrBorrows(
        data?.asset || '',
        'supply',
    )?.amountNative;
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
                                    amountWalletNative,
                                    data.asset,
                                )}
                                setIsMax={setIsMax}
                            />

                            {/* <h3 className="mt-6 text-neutral400">Collaterize</h3>
                            <div className="mt-1">
                                <BasicToggle
                                    checked={asCollateral}
                                    onChange={() => setAsCollateral(!asCollateral)}
                                    disabled={!data.canBeCollat}
                                />
                            </div> */}

                            <h3 className="mt-6 text-neutral400">Health Factor</h3>
                            <HealthFactor asset={data.asset} amount={amount} type={'supply'} />

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={[
                                    {
                                        label: 'Supply APR (%)',
                                        value: `${apy}%`,
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
                                setIsMax={setIsMax}
                                loading={
                                    Number(bigNumberToNative(amountWithdraw, data.asset)) === 0
                                }
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
                            <TransactionStatus success={isSuccess} full />
                        </div>
                    )}
                </>
            )}
            <ModalFooter>
                <Button
                    primary
                    disabled={isSuccess || error.length !== 0 || !amount}
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

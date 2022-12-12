import React, { useEffect } from 'react';
import { FaGasPump } from 'react-icons/fa';
import { useMediatedState } from 'react-use';
import { TransactionStatus } from '../../components/statuses';
import { CoinInput } from '../../components/inputs';
import { Button, DropdownButton } from '../../components/buttons';
import { inputMediator, convertStringFormatToNumber } from '../../../utils/helpers';
import { HealthFactor } from '../../components/displays';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { ISupplyBorrowProps } from '../utils';
import { useModal } from '../../../hooks/ui';
import { borrow, repay } from '@vmex/sdk';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';
import { useAccount, useSigner } from 'wagmi';
import { useUserTrancheData, useTrancheMarketsData } from '../../../api';
import { BigNumber } from 'ethers';
import {
    unformattedStringToBigNumber,
    bigNumberToNative,
    bigNumberToUnformattedString,
} from '../../../utils/sdk-helpers';

export const BorrowAssetDialog: React.FC<ISupplyBorrowProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
    tab,
}) => {
    const { isSuccess, submitTx, isLoading, error } = useModal('borrow-asset-dialog');
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [isMax, setIsMax] = React.useState(false);
    const [view, setView] = React.useState('Borrow');
    const { address } = useAccount();
    const { data: signer } = useSigner();

    const { findAssetInUserSuppliesOrBorrows, findAmountBorrowable } = useUserTrancheData(
        address,
        data?.trancheId || 0,
    );
    const { getTrancheMarket } = useTrancheMarketsData(data?.trancheId || 0);

    const handleClick = async () => {
        if (data && signer) {
            await submitTx(async () => {
                const res = view?.includes('Borrow')
                    ? await borrow({
                          underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          interestRateMode: 2,
                          signer: signer,
                          network: NETWORK,
                          // referrer: number,
                          // collateral: boolean,
                          // test: boolean
                      })
                    : await repay({
                          asset: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                          trancheId: data.trancheId,
                          amount: convertStringFormatToNumber(amount),
                          rateMode: 2,
                          signer: signer,
                          network: NETWORK,
                          isMax: isMax,
                          // referrer: number,
                          // collateral: boolean,
                          // test: boolean
                      });
                return res;
            });
        }
    };

    useEffect(() => {
        if (data?.view) setView('Repay');
    }, [data?.view]);

    const amountBorrwable = findAmountBorrowable(
        data?.asset || '',
        getTrancheMarket(data?.asset || '').available,
        getTrancheMarket(data?.asset || '').availableNative,
    ).amountNative;
    const apy = getTrancheMarket(data?.asset || '').borrowApy;
    const amountRepay =
        findAssetInUserSuppliesOrBorrows(data?.asset || '', 'borrow')?.amountNative ||
        BigNumber.from('0');

    return data && data.asset ? (
        <>
            {view?.includes('Borrow') ? (
                <>
                    <ModalHeader
                        dialog="borrow-asset-dialog"
                        title={name}
                        asset={data.asset}
                        tab={tab}
                        onClick={!amountRepay.eq(BigNumber.from('0')) ? setView : () => {}}
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
                                balance={bigNumberToUnformattedString(amountBorrwable, data.asset)}
                                type="collateral"
                                setIsMax={setIsMax}
                            />

                            <h3 className="mt-6 text-neutral400">Health Factor</h3>
                            <HealthFactor asset={data.asset} amount={amount} type={'borrow'} />

                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={[
                                    {
                                        label: 'Borrow APR (%)',
                                        value: `${apy}%`,
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
                //repay
                <>
                    <ModalHeader
                        dialog="borrow-asset-dialog"
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
                                balance={bigNumberToUnformattedString(amountRepay, data.asset)}
                                type="owed"
                                setIsMax={setIsMax}
                                loading={Number(bigNumberToNative(amountRepay, data.asset)) === 0}
                            />

                            <h3 className="mt-6 text-neutral400">Health Factor</h3>
                            <HealthFactor asset={data.asset} amount={amount} type={'repay'} />
                            {console.log(bigNumberToNative(amountRepay, data.asset))}
                            <ModalTableDisplay
                                title="Transaction Overview"
                                content={[
                                    {
                                        label: 'Remaining Balance',
                                        value: `${
                                            amount
                                                ? bigNumberToNative(
                                                      amountRepay.sub(
                                                          unformattedStringToBigNumber(
                                                              amount,
                                                              data.asset,
                                                          ),
                                                      ),
                                                      data.asset,
                                                  )
                                                : bigNumberToNative(amountRepay, data.asset)
                                        } ${data.asset}`,
                                        loading:
                                            Number(bigNumberToNative(amountRepay, data.asset)) ===
                                            0,
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
            <ModalFooter between>
                <div className="mt-5 sm:mt-6 flex justify-between items-end">
                    {/* <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <FaGasPump />
                            <span>Gas Limit</span>
                        </div>
                        <div>
                            <DropdownButton
                                items={[{ text: 'Normal' }, { text: 'Low' }, { text: 'High' }]}
                                direction="right"
                            />
                        </div>
                    </div> */}
                </div>
                <Button
                    primary
                    disabled={isSuccess || error.length !== 0 || !amount}
                    onClick={handleClick}
                    label="Submit Transaction"
                    loading={isLoading}
                />
            </ModalFooter>
        </>
    ) : (
        <></>
    );
};

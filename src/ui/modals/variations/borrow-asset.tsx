import React from 'react';
import { FaGasPump } from 'react-icons/fa';
import { useMediatedState } from 'react-use';
import { TransactionStatus, ActiveStatus } from '../../components/statuses';
import { CoinInput } from '../../components/inputs';
import { Button, DropdownButton } from '../../components/buttons';
import { inputMediator, convertStringFormatToNumber } from '../../../utils/helpers';
import { HealthFactor } from '../../components/displays';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { IDialogProps } from '../utils';
import { useModal } from '../../../hooks/ui';
import { borrow, repay } from '@vmex/sdk';
import { MAINNET_ASSET_MAPPINGS, NETWORK } from '../../../utils/sdk-helpers';

export const BorrowAssetDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
    tab,
}) => {
    const { isSuccess, submitTx, isLoading } = useModal('borrow-asset-dialog');
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [view, setView] = React.useState('Borrow');

    const handleClick = async () => {
        await submitTx(async () => {
            view?.includes('Borrow')
                ? await borrow({
                      underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                      trancheId: data.tranche,
                      amount: convertStringFormatToNumber(amount),
                      interestRateMode: 2,
                      signer: data.signer,
                      network: NETWORK,
                      // referrer: number,
                      // collateral: boolean,
                      // test: boolean
                  })
                : await repay({
                      asset: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                      trancheId: data.tranche,
                      amount: convertStringFormatToNumber(amount),
                      rateMode: 2,
                      signer: data.signer,
                      network: NETWORK,
                      // referrer: number,
                      // collateral: boolean,
                      // test: boolean
                  });
        });
    };

    return (
        data &&
        data.asset && (
            <>
                {view?.includes('Borrow') ? (
                    <>
                        <ModalHeader
                            dialog="borrow-asset-dialog"
                            title={name}
                            asset={data.asset}
                            tab={tab}
                            onClick={setView}
                            primary
                        />
                        {!isSuccess ? (
                            // Default State
                            <>
                                <h3 className="mt-5 text-gray-400">Amount</h3>
                                <CoinInput
                                    amount={amount}
                                    setAmount={setAmount}
                                    coin={{
                                        logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={data.amount}
                                    type="collateral"
                                />

                                <h3 className="mt-6 text-gray-400">Health Factor</h3>
                                <HealthFactor asset={data.asset} amount={amount} type={'borrow'} />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Borrow APR (%)',
                                            value: `${data.apy_perc}%`,
                                        },
                                        {
                                            label: 'Collateralization',
                                            value: <ActiveStatus active={false} size="sm" />,
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
                            dialog="borrow-asset-dialog"
                            title={name}
                            asset={data.asset}
                            tab={tab}
                            onClick={setView}
                        />
                        {!isSuccess ? (
                            // Default State
                            <>
                                <h3 className="mt-5 text-gray-400">Amount</h3>
                                <CoinInput
                                    amount={amount}
                                    setAmount={setAmount}
                                    coin={{
                                        logo: `/coins/${data.asset?.toLowerCase()}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={data.amountWithdrawOrRepay}
                                    type="owed"
                                />

                                <h3 className="mt-6 text-gray-400">Health Factor</h3>
                                <HealthFactor asset={data.asset} amount={amount} type={'repay'} />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Remaining Balance',
                                            value: `${
                                                parseFloat(
                                                    convertStringFormatToNumber(
                                                        data.amountWithdrawOrRepay,
                                                    ),
                                                ) - parseFloat(convertStringFormatToNumber(amount))
                                            }`,
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
                        <div className="flex flex-col">
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
                        </div>
                    </div>
                    <Button
                        primary
                        disabled={isSuccess}
                        onClick={handleClick}
                        label="Submit Transaction"
                        loading={isLoading}
                    />
                </ModalFooter>
            </>
        )
    );
};

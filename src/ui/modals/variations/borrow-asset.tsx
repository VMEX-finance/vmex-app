import React from 'react';
import { FaGasPump } from 'react-icons/fa';
import { useMediatedState } from 'react-use';
import { TransactionStatus, ActiveStatus } from '../../components/statuses';
import { CoinInput } from '../../components/inputs';
import { Button, DropdownButton } from '../../components/buttons';
import { inputMediator, convertNativeTokenStringToNumber } from '../../../utils/helpers';
import { HealthFactor } from '../../components/displays';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { IDialogProps } from '../utils';
import { useModal } from '../../../hooks/ui';
import { borrow } from '@vmex/sdk';
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
            await borrow({
                underlying: MAINNET_ASSET_MAPPINGS.get(data.asset) || '',
                trancheId: data.tranche,
                amount: convertNativeTokenStringToNumber(amount),
                interestRateMode: 2,
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
                                        logo: `/tokens/token-${data.asset}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={data.amount}
                                    type="collateral"
                                />

                                <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
                                <HealthFactor liquidation={1.0} value={1.24} />

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
                                        logo: `/tokens/token-${data.asset}.svg`,
                                        name: data.asset,
                                    }}
                                    balance={'0.23'}
                                    type="owed"
                                />

                                <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
                                <HealthFactor liquidation={1.0} value={1.24} />

                                <ModalTableDisplay
                                    title="Transaction Overview"
                                    content={[
                                        {
                                            label: 'Borrow APR (%)',
                                            value: `${0.44}%`,
                                        },
                                        {
                                            label: 'Remaining Balance',
                                            value: `${0.0}`,
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

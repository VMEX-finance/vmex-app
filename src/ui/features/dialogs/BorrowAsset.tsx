import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { FaGasPump } from 'react-icons/fa';
import { useMediatedState } from 'react-use';
import { TransactionStatus, ActiveStatus } from '../../components/statuses';
import { CoinInput } from '../../components/inputs';
import { Button, DropdownButton } from '../../components/buttons';
import { inputMediator } from '../../../utils/helpers';
import { HealthFactor } from '../../components/displays';
import { useTransactionsContext } from '../../../store/contexts';

interface IOwnedAssetDetails {
    name?: string;
    isOpen?: boolean;
    data?: any;
    closeDialog(e: any): void;
}

export const BorrowAssetDialog: React.FC<IOwnedAssetDetails> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const { newTransaction } = useTransactionsContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    // Temp States for demo
    const [isUSDCSelected, setIsUSDCSelected] = React.useState(false);
    const [isWBTCSelected, setIsWBTCSelected] = React.useState(false);

    const [amount, setAmount] = useMediatedState(inputMediator, '');

    return (
        data && (
            <>
                <div className="flex flex-row justify-between">
                    <div className="mt-3 text-left sm:mt-5">
                        <Dialog.Title
                            as="h3"
                            className="text-xl leading-6 font-medium text-gray-900"
                        >
                            {name} {data.asset}
                        </Dialog.Title>
                    </div>
                    <div
                        className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                        onClick={() => closeDialog('borrow-asset-dialog')}
                    >
                        <IoIosClose className="w-7 h-7" />
                    </div>
                </div>
                {!isSuccess && !isError ? (
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
                            type="collateral"
                        />

                        <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
                        <div>
                            <HealthFactor liquidation={1.0} value={1.24} />
                        </div>

                        <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
                        <div
                            className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}
                        >
                            <div className="flex flex-col gap-2">
                                <span>Borrow APR%</span>
                                <span>Collateralization</span>
                            </div>

                            <div className="min-w-[100px] flex flex-col gap-2">
                                <span>0.44%</span>
                                <ActiveStatus active={false} size="sm" />
                            </div>
                        </div>

                        <div className="mt-5 sm:mt-6 flex justify-between items-end">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <FaGasPump />
                                    <span>Gas Limit</span>
                                </div>
                                <div>
                                    <DropdownButton
                                        items={[
                                            { text: 'Normal' },
                                            { text: 'Low' },
                                            { text: 'High' },
                                        ]}
                                        direction="right"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} full />
                    </div>
                )}

                <div className="mt-6">
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            setIsSuccess(true);
                            newTransaction(
                                `0x${Math.floor(Math.random() * 9)}...${Math.floor(
                                    Math.random() * 9,
                                )}${Math.floor(Math.random() * 9)}n`,
                            );

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('borrow-asset-dialog');
                            }, 2000);
                        }}
                        label="Submit Transaction"
                    />
                </div>
            </>
        )
    );
};

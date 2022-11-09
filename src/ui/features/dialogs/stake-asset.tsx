import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { FaGasPump } from 'react-icons/fa';
import { useMediatedState } from 'react-use';
import { CoinInput } from '../../components/inputs';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { Button, DropdownButton } from '../../components/buttons';
import { inputMediator } from '../../../utils/helpers';
import { useTransactionsContext } from '../../../store/contexts';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { IDialogProps } from '.';
import { ModalHeader } from '../../../ui/components/modals';

export const StakeAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { newTransaction } = useTransactionsContext();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const handleSubmit = () => {
        setIsSuccess(true);
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}s`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('stake-asset-dialog');
        }, TIMER_CLOSE_DELAY);
    };

    return (
        data &&
        data.asset && (
            <>
                <ModalHeader dialog="stake-asset-dialog" title={name} asset={data.asset} />
                {!isSuccess ? (
                    // Default State
                    <>
                        <h3 className="mt-5 text-gray-400">Amount</h3>
                        <CoinInput
                            amount={amount}
                            setAmount={setAmount}
                            coin={{
                                logo: data.logo,
                                name: data.asset,
                            }}
                            balance={'0.23'}
                        />

                        <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
                        <div
                            className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}
                        >
                            <div className="flex flex-col gap-2">
                                <span>Supply APR%</span>
                                <span>Collateralization</span>
                                <span>Insurance</span>
                            </div>

                            <div className="min-w-[100px] flex flex-col gap-2">
                                <span>0.44%</span>
                                {amount && <ActiveStatus active={true} size="sm" />}
                                {amount && <ActiveStatus active={false} size="sm" />}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} full />
                    </div>
                )}

                <div className="mt-5 sm:mt-6 flex justify-between items-end">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <FaGasPump />
                            <span>Gas Limit</span>
                        </div>
                        <div>
                            <DropdownButton
                                items={[{ text: 'Normal' }, { text: 'Low' }, { text: 'High' }]}
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            disabled={isSuccess}
                            onClick={handleSubmit}
                            label="Submit Transaction"
                        />
                    </div>
                </div>
            </>
        )
    );
};

import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { useMediatedState } from 'react-use';
import { inputMediator } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button } from '../../components/buttons';
import { BasicToggle } from '../../components/toggles';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';
import { useTransactionsContext } from '../../../store/contexts';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';
import { ModalHeader } from '../../components/modals';

interface IOwnedAssetDetails {
    name?: string;
    isOpen?: boolean;
    data?: any;
    closeDialog(e: any): void;
}

export const SupplyAssetDialog: React.FC<IOwnedAssetDetails> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const { newTransaction } = useTransactionsContext();

    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [asCollateral, setAsCollateral] = React.useState(false);
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const handleSubmit = () => {
        setIsSuccess(true);
        newTransaction(
            `0x${Math.floor(Math.random() * 9)}...${Math.floor(Math.random() * 9)}${Math.floor(
                Math.random() * 9,
            )}p`,
        );

        setTimeout(() => {
            setIsSuccess(false);
            closeDialog('loan-asset-dialog');
        }, TIMER_CLOSE_DELAY);
    };

    return (
        data &&
        data.asset && (
            <>
                <ModalHeader dialog="loan-asset-dialog" title={name} asset={data.asset} />
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
                        />

                        <h3 className="mt-6 text-gray-400">Collaterize</h3>
                        <div className="mt-1">
                            <BasicToggle
                                checked={asCollateral}
                                onChange={() => setAsCollateral(!asCollateral)}
                            />
                        </div>

                        <h3 className="mt-6 text-gray-400">Transaction Overview</h3>
                        <div
                            className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}
                        >
                            <div className="flex flex-col gap-2">
                                <span>Supply APR%</span>
                                <span>Collateralization</span>
                            </div>

                            <div className="min-w-[100px] flex flex-col gap-2">
                                <span>0.44%</span>
                                <ActiveStatus active={asCollateral} size="sm" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={isSuccess} full />
                    </div>
                )}
                <div className="mt-5 sm:mt-6">
                    <Button
                        disabled={isSuccess || isError}
                        onClick={handleSubmit}
                        label={'Submit Transaction'}
                    />
                </div>
            </>
        )
    );
};

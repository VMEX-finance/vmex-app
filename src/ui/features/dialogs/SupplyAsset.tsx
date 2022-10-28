import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { useMediatedState } from 'react-use';
import { inputMediator } from '../../../utils/helpers';
import { CoinInput } from '../../components/inputs';
import { Button } from '../..//components/buttons';
import { BasicToggle } from '../../components/toggles';
import { ActiveStatus, TransactionStatus } from '../../components/statuses';

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
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [asCollateral, setAsCollateral] = React.useState(false);

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
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Please be aware when lending an asset...
                            </p>
                        </div>
                    </div>
                    <div
                        className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                        onClick={() => closeDialog('loan-asset-dialog')}
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
                ) : isSuccess ? (
                    // Success State
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={true} full />
                    </div>
                ) : (
                    // Error State
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={false} full />
                    </div>
                )}
                <div className="mt-5 sm:mt-6">
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            setIsSuccess(true);

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('loan-asset-dialog');
                            }, 2000);
                        }}
                        label={'Submit Transaction'}
                    />
                </div>
            </>
        )
    );
};

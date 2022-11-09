import React from 'react';
import { Dialog } from '@headlessui/react';
import { IoIosClose } from 'react-icons/io';
import { TransactionStatus } from '../../components/statuses';
import { Button } from '../../components/buttons';
import { TIMER_CLOSE_DELAY } from '../../../utils/constants';

interface IDialogProps {
    name?: string;
    data?: any;
    closeDialog(e: any): void;
}

export const MyTranchesDialog: React.FC<IDialogProps> = ({ name, data, closeDialog }) => {
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                        {name}
                    </Dialog.Title>
                </div>
                <div
                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                    onClick={() => closeDialog('my-tranches-dialog')}
                >
                    <IoIosClose className="w-7 h-7" />
                </div>
            </div>
            {!isSuccess && !isError ? (
                // Default State
                <>
                    <h3 className="mt-6 text-gray-400">Name</h3>
                    <div
                        className={`mt-2 flex justify-between rounded-lg border border-neutral-900 p-4 lg:py-6`}
                    ></div>
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} full />
                </div>
            )}

            <div className="mt-5 sm:mt-6 flex justify-end items-end">
                <div>
                    <Button
                        disabled={isSuccess || isError}
                        onClick={() => {
                            setIsSuccess(true);
                            // TODO: implement add tranche to UI

                            setTimeout(() => {
                                setIsSuccess(false);
                                closeDialog('my-tranches-dialog');
                            }, TIMER_CLOSE_DELAY);
                        }}
                        label="Save"
                    />
                </div>
            </div>
        </>
    );
};

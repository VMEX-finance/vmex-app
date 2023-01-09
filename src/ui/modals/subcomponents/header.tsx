import React from 'react';
import { Dialog } from '@headlessui/react';
import { useDialogController } from '../../../hooks/dialogs';
import { IoIosClose } from 'react-icons/io';
import { IDialogNames } from '../../../store/modals';

type IModalHeaderProps = {
    title?: string;
    dialog: IDialogNames;
    asset?: string;
    tab?: string;
    primary?: boolean;
    onClick?: Function;
};

export const ModalHeader = ({ title, dialog, asset, tab, primary, onClick }: IModalHeaderProps) => {
    const { closeDialog } = useDialogController();

    return (
        <>
            {tab ? (
                <>
                    {primary ? (
                        <>
                            <div className="flex flex-row justify-between">
                                <div className="text-left flex flex-row gap-2">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl leading-6 font-medium text-neutral900"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    {onClick && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl leading-6 font-medium text-neutral-400 cursor-pointer"
                                            onClick={() => onClick(tab)}
                                        >
                                            {tab}
                                        </Dialog.Title>
                                    )}
                                </div>
                                <button
                                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition duration-200 p-[0.5px]"
                                    onClick={() => closeDialog(dialog)}
                                >
                                    <IoIosClose className="w-7 h-7" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-row justify-between">
                                <div className="text-left flex flex-row gap-2">
                                    {onClick && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl leading-6 font-medium text-neutral-400 cursor-pointer"
                                            onClick={() => onClick(title)}
                                        >
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl leading-6 font-medium text-neutral900"
                                    >
                                        {tab}
                                    </Dialog.Title>
                                </div>
                                <button
                                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition duration-200 p-[0.5px]"
                                    onClick={() => closeDialog(dialog)}
                                >
                                    <IoIosClose className="w-7 h-7" />
                                </button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="flex flex-row justify-between items-center">
                        <div className="text-left">
                            <Dialog.Title
                                as="h3"
                                className="text-xl leading-6 font-medium text-neutral-900 dark:text-neutral-100"
                            >
                                {title} {asset ? asset : ''}
                            </Dialog.Title>
                        </div>
                        <button
                            className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition duration-200 p-[0.5px]"
                            onClick={() => closeDialog(dialog)}
                        >
                            <IoIosClose className="w-7 h-7" />
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

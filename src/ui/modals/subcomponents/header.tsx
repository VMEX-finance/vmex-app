import React from 'react';
import { Dialog } from '@headlessui/react';
import { useDialogController } from '../../../hooks/dialogs';
import { IoIosClose } from 'react-icons/io';
import { IDialogNames } from '../../../store/modals';
import { useSupplyContext } from '../../../store/contexts';

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
                                <div className="mt-3 text-left sm:mt-5 flex flex-row gap-2">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl leading-6 font-medium text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    {onClick && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl leading-6 font-medium text-gray-400 cursor-pointer"
                                            onClick={() => onClick(tab)}
                                        >
                                            {tab}
                                        </Dialog.Title>
                                    )}
                                </div>
                                <button
                                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                                    onClick={() => closeDialog(dialog)}
                                >
                                    <IoIosClose className="w-7 h-7" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-row justify-between">
                                <div className="mt-3 text-left sm:mt-5 flex flex-row gap-2">
                                    {onClick && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl leading-6 font-medium text-gray-400 cursor-pointer"
                                            onClick={() => onClick(title)}
                                        >
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl leading-6 font-medium text-gray-900"
                                    >
                                        {tab}
                                    </Dialog.Title>
                                </div>
                                <button
                                    className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
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
                    <div className="flex flex-row justify-between items-center mt-3 sm:mt-5">
                        <div className="text-left">
                            <Dialog.Title
                                as="h3"
                                className="text-xl leading-6 font-medium text-gray-900"
                            >
                                {title}
                            </Dialog.Title>
                        </div>
                        <button
                            className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
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

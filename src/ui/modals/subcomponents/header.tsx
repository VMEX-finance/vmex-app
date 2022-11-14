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
};

export const ModalHeader = ({ title, dialog, asset, tab, primary }: IModalHeaderProps) => {
    const { view, setView } = useSupplyContext();
    const { closeDialog } = useDialogController();

    return (
        <>
            {primary ? (
                <>
                    <div className="flex flex-row justify-between items-center mt-3 sm:mt-5">
                        <div className="text-left flex flex-row gap-2">
                            <Dialog.Title
                                as="h3"
                                className="text-xl leading-6 font-medium text-gray-900"
                            >
                                {title}
                            </Dialog.Title>
                            {tab && (
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl leading-6 font-medium text-gray-400"
                                    onClick={() => setView(tab)}
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
                            <Dialog.Title
                                as="h3"
                                className="text-xl leading-6 font-medium text-gray-400"
                                onClick={() => setView(title)}
                            >
                                {title}
                            </Dialog.Title>
                            {tab && (
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl leading-6 font-medium text-gray-900"
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
            )}
        </>
    );
};

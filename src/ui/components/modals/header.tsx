import React from 'react';
import { Dialog } from '@headlessui/react';
import { useDialogController } from '../../../hooks/dialogs';
import { IoIosClose } from 'react-icons/io';
import { IDialogNames } from '../../../store/modals';

type IModalHeaderProps = {
    title?: string;
    dialog: IDialogNames;
    asset?: string;
};

export const ModalHeader = ({ title, dialog, asset }: IModalHeaderProps) => {
    const { closeDialog } = useDialogController();

    return (
        <div className="flex flex-row justify-between items-center mt-3 sm:mt-5">
            <div className="text-left">
                <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                    {title} {asset ? asset : ''}
                </Dialog.Title>
            </div>
            <button
                className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 hover:text-neutral-600 transition duration-200"
                onClick={() => closeDialog(dialog)}
            >
                <IoIosClose className="w-7 h-7" />
            </button>
        </div>
    );
};

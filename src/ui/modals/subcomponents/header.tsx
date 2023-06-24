import React from 'react';
import { Dialog } from '@headlessui/react';
import { useDialogController } from '../../../hooks';
import { IoIosClose } from 'react-icons/io';
import { IDialogNames } from '../../../store/modals';

type IModalHeaderProps = {
    dialog: IDialogNames;
    asset?: string;
    tabs: string[];
    onClick?: Function;
    active?: string;
};

export const ModalHeader = ({ dialog, asset, tabs, onClick, active }: IModalHeaderProps) => {
    const { closeDialog } = useDialogController();
    const current = active ? active : tabs[0];

    return (
        <div className="flex flex-row justify-between">
            <div className="text-left flex flex-row gap-2">
                {tabs.map((tab, i) => (
                    <Dialog.Title
                        key={`dialog-title-${i}`}
                        as="h3"
                        className={`
                    text-xl leading-6 font-medium transition duration-150
                    ${
                        tab === current
                            ? 'text-neutral-900 cursor-default'
                            : 'text-neutral-400 cursor-pointer hover:text-neutral-500'
                    }
                  `}
                        onClick={() => (onClick ? onClick(tab) : {})}
                    >
                        {tab} {asset ? asset : ''}
                    </Dialog.Title>
                ))}
            </div>
            <button
                className="self-baseline h-fit w-fit cursor-pointer text-neutral-900 dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-300 transition duration-200 p-[0.5px]"
                onClick={() => closeDialog(dialog)}
            >
                <IoIosClose className="w-7 h-7" />
            </button>
        </div>
    );
};

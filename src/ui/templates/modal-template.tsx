import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDialogController } from '../../hooks/dialogs';
import {
    BorrowAssetDialog,
    BorrowedAssetDetailsDialog,
    StakeAssetDialog,
    SupplyAssetDialog,
} from '../../ui/features/dialogs';

interface IModalWrapper extends React.PropsWithChildren {
    name?: string;
    isOpen?: boolean;
    data?: any;
    closeDialog(e: any): void;
}

export const ModalWrapper: React.FC<IModalWrapper> = ({
    name,
    isOpen,
    data,
    closeDialog,
    children,
}) => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => closeDialog(name)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative overflow-[inherit] bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 max-w-md lg:max-w-xl w-full sm:p-6 font-basefont">
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export const ModalTemplate: React.FC = () => {
    const { getDialogProps } = useDialogController();

    return (
        <>
            <React.Fragment>
                <ModalWrapper {...getDialogProps('loan-asset-dialog')}>
                    <SupplyAssetDialog {...getDialogProps('loan-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('borrowed-asset-details-dialog')}>
                    <BorrowedAssetDetailsDialog
                        {...getDialogProps('borrowed-asset-details-dialog')}
                    />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('borrow-asset-dialog')}>
                    <BorrowAssetDialog {...getDialogProps('borrow-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>

            <React.Fragment>
                <ModalWrapper {...getDialogProps('stake-asset-dialog')}>
                    <StakeAssetDialog {...getDialogProps('stake-asset-dialog')} />
                </ModalWrapper>
            </React.Fragment>
        </>
    );
};

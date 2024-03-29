import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface IModalWrapperProps extends React.PropsWithChildren {
    name?: string;
    isOpen?: boolean;
    data?: any;
    closeDialog(e: any): void;
    z?: `z${string}`;
}

export const ModalWrapper: React.FC<IModalWrapperProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
    children,
    z,
}) => {
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className={`relative ${z ? z : 'z-[1001]'}`}
                onClose={() => closeDialog(name)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-neutral-800 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex justify-center p-2 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={`relative overflow-[inherit] bg-white dark:bg-brand-black dark:text-neutral-300 rounded-lg text-left shadow-xl transform transition-all sm:my-4 max-w-md lg:max-w-xl w-full px-3 py-4 sm:p-4 font-basefont`}
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

import React, { useEffect, useState } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button } from '@/ui/components';
import { useDialogController } from '@/hooks';
import { RxCopy } from 'react-icons/rx';
import { useAccount } from 'wagmi';
import { truncate } from '@/utils';
import { useUserReferrals } from '@/api';

export const ReferralsDialog: React.FC<IDialogProps> = ({ name, isOpen, data }) => {
    const { address } = useAccount();
    const { closeDialog } = useDialogController();
    const [showSuccess, setShowSuccess] = useState(false);
    const { queryUserReferrals } = useUserReferrals(address);

    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setShowSuccess(true);
        }
    };

    useEffect(() => {
        if (showSuccess) {
            const timeout = setTimeout(() => setShowSuccess(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [showSuccess]);

    return (
        <>
            <ModalHeader dialog="referrals-dialog" tabs={['Referrals']} />
            {address ? (
                <div className="flex flex-col pt-4 pb-2 px-2">
                    <div className="flex items-center justify-between text-sm text-neutral-800 dark:text-neutral-300">
                        <span>My Address</span>
                        <span>Used</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={copyToClipboard}
                            className="py-1 flex items-center gap-2 text-lg transition duration-100 hover:text-neutral-800 dark:hover:text-white"
                        >
                            <span>{truncate(address, 6)}</span>
                            <RxCopy />
                            {showSuccess && (
                                <span className="absolute text-sm mt-10 text-green-600 dark:text-green-500">
                                    Copied
                                </span>
                            )}
                        </button>
                        <span className="text-lg">{queryUserReferrals.data}</span>
                    </div>
                    <div>
                        <span></span>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center pt-12 pb-4">
                    <span className="text-neutral-700 dark:text-neutral-400">
                        Referrals Not Available
                    </span>
                </div>
            )}

            <ModalFooter>
                <Button primary onClick={() => closeDialog('referrals-dialog')} label="Close" />
            </ModalFooter>
        </>
    );
};

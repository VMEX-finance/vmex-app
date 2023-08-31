import React, { useEffect, useState } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button } from '../../components';
import { useDialogController } from '../../../hooks';
import { RxCopy } from 'react-icons/rx';

export const ReferralsDialog: React.FC<IDialogProps> = ({ name, isOpen, data }) => {
    const { closeDialog } = useDialogController();
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReferralCode('ABC123DEF456');
        }
    }, [isOpen]);

    return (
        <>
            <ModalHeader dialog="referrals-dialog" tabs={['Referrals']} />
            {referralCode ? (
                <div className="flex flex-col pt-6 pb-2 px-2">
                    <div className="flex items-center justify-between text-sm text-neutral-900 dark:text-neutral-300">
                        <span>My Code</span>
                        <span>Used</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="py-1 flex items-center gap-2 text-lg transition duration-100 hover:text-neutral-800 dark:hover:text-white">
                            <span>{referralCode}</span>
                            <RxCopy />
                        </button>
                        <span className="text-lg">0</span>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center pt-12 pb-4">
                    <span className="text-neutral-700 dark:text-neutral-400">
                        No Referral Code Available
                    </span>
                </div>
            )}

            <ModalFooter>
                <Button primary onClick={() => closeDialog('referrals-dialog')} label="Close" />
            </ModalFooter>
        </>
    );
};

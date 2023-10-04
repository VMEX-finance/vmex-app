import React, { useState } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button, TransactionStatus } from '@/ui/components';

export const ConfirmationDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async () => {
        setIsLoading(true);
        await data.action();
        setIsLoading(false);
    };
    return (
        data &&
        data.asset && (
            <>
                <ModalHeader dialog="confirmation-dialog" tabs={[`${name}`]} asset={data.asset} />
                {!data.success ? (
                    // Default State
                    <div className="py-6">
                        <p>{data.message ? data.message : 'Are you sure you want to proceed?'}</p>
                    </div>
                ) : (
                    <div className="mt-8 mb-6">
                        <TransactionStatus success={data.success} full />
                    </div>
                )}

                <ModalFooter>
                    <Button
                        primary
                        disabled={data.success || isLoading}
                        onClick={handleSubmit}
                        label="Submit Transaction"
                        loading={data.loading || isLoading}
                        loadingText="Submitting"
                    />
                </ModalFooter>
            </>
        )
    );
};

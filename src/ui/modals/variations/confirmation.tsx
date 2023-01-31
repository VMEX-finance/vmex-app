import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { Button, TransactionStatus } from '../../components';

export const ConfirmationDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    return (
        data &&
        data.asset && (
            <>
                <ModalHeader dialog={'confirmation-dialog'} title={name} asset={data.asset} />
                {!data.success ? (
                    // Default State
                    <div className="py-8">
                        <p>{data.message ? data.message : 'Are you sure you want to proceed?'}</p>
                    </div>
                ) : (
                    <div className="mt-10 mb-8">
                        <TransactionStatus success={data.success} full />
                    </div>
                )}

                <ModalFooter>
                    <Button
                        primary
                        disabled={data.success}
                        onClick={data.action}
                        label="Submit Transaction"
                        loading={data.loading}
                    />
                </ModalFooter>
            </>
        )
    );
};

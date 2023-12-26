import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button } from '@/ui/components';
import { useDialogController } from '@/hooks';
import { YourTransactionsTable } from '@/ui/tables';

export const TransactionsDialog: React.FC<IDialogProps> = ({ name, isOpen, data }) => {
    const { closeDialog } = useDialogController();

    return (
        <>
            <ModalHeader dialog="transactions-dialog" tabs={[`Transaction History`]} />

            <div className="mt-4">
                <YourTransactionsTable />
            </div>

            <ModalFooter>
                <Button type="accent" onClick={() => closeDialog('transactions-dialog')}>
                    Close
                </Button>
            </ModalFooter>
        </>
    );
};

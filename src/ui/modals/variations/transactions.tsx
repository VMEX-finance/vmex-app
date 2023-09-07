import React from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button, TransactionStatus } from '../../components';
import { useTransactionsContext } from '../../../store';
import { useDialogController } from '../../../hooks';
import { DEFAULT_NETWORK, NETWORKS, truncate } from '../../../utils';
import { getNetwork } from '@wagmi/core';

export const TransactionsDialog: React.FC<IDialogProps> = ({ name, isOpen, data }) => {
    const { transactions } = useTransactionsContext();
    const { closeDialog } = useDialogController();
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const renderStatus = (status: 'error' | 'pending' | 'complete') => {
        switch (status) {
            case 'complete': {
                return <span className="text-green-400">Success</span>;
            }
            case 'pending': {
                return <span className="text-yellow-400">Pending</span>;
            }
            default: {
                return <span className="text-red-600">Error</span>;
            }
        }
    };

    return (
        <>
            <ModalHeader dialog="transactions-dialog" tabs={[`Transaction History`]} />
            {transactions?.length ? (
                <div className="flex flex-col pt-6 pb-2 px-2 divide-y dark:divide-neutral-800">
                    {transactions.map((el, i) => (
                        <div className="flex items-center justify-between" key={`transaction-${i}`}>
                            <a
                                href={`${NETWORKS[network].explorer}/tx/${el.text}`}
                                className="py-1"
                            >
                                {truncate(el.text, 8)}
                            </a>
                            {renderStatus(el.status)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center pt-12 pb-4">
                    <span className="text-neutral-700 dark:text-neutral-400">
                        No Transaction History Available
                    </span>
                </div>
            )}

            <ModalFooter>
                <Button primary onClick={() => closeDialog('transactions-dialog')} label="Close" />
            </ModalFooter>
        </>
    );
};
import { truncate, NETWORKS, DEFAULT_NETWORK } from '../../../utils';
import React from 'react';
import { getNetwork } from '@wagmi/core';

type IToastStatusProps = {
    status: 'error' | 'success' | 'pending';
    transaction?: string;
};

export const ToastStatus = ({ status, transaction }: IToastStatusProps) => {
    const network = getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    const determineText = () => {
        switch (status) {
            case 'error':
                return `${transaction ? 'Error while submitted transaction' : 'Error'}`;
            case 'success':
                return `${transaction ? 'Transaction completed' : 'Success'}`;
            case 'pending':
                return `${transaction ? 'Transaction submitted' : 'Loading'}`;
        }
    };
    return (
        <div className="w-full flex justify-between items-center">
            <span>{determineText()}</span>
            {transaction && (
                <a
                    href={`${NETWORKS[network].explorer}/tx/${transaction}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-brand-blue hover:text-brand-purple transition duration-150"
                >
                    {truncate(transaction, 3)}
                </a>
            )}
        </div>
    );
};

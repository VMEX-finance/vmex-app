import { useQueryClient } from '@tanstack/react-query';
import { Transaction } from 'ethers';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastStatus } from '../ui/components/statuses';

// Types
type ITransactionProps = {
    text: string;
    status: 'pending' | 'complete' | 'error';
    onClick?: any;
};

export type ITransactionsStoreProps = {
    transactions: Array<ITransactionProps>;
    setTransactions?: any;
    isAnyTransactionLoading: boolean;
    newTransaction: (tx: Transaction) => void;
    updateTransaction: (hash: string, status: string) => void;
};

// Context
const TransactionsContext = createContext<ITransactionsStoreProps>({
    transactions: [],
    newTransaction(tx) {},
    updateTransaction(hash, status) {},
    isAnyTransactionLoading: false,
});

// Wrapper
export function TransactionsStore(props: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Array<ITransactionProps>>([]);
    const queryClient = useQueryClient();
    const [isAnyTransactionLoading, setIsAnyTransactionLoading] = useState(false);

    // For mocking data
    useEffect(() => {
        const interval = setInterval(() => {
            const shallow = [...transactions];
            const completed = shallow.map((obj) => ({ ...obj, status: 'complete' }));
            setTransactions(completed as any);
        }, 10000);

        return () => clearInterval(interval);
    }, [transactions]);

    const newTransaction = async (tx: Transaction) => {
        if (!tx.hash) return;
        const { hash } = tx;
        setIsAnyTransactionLoading(true);
        const toastId = toast.loading(<ToastStatus status="pending" transaction={tx.hash} />);

        const shallow = [...transactions];
        shallow.push({ text: hash, status: 'pending' });
        setTransactions(shallow);

        const receipt = await (tx as any).wait();
        if (receipt?.blockHash) {
            toast.update(toastId, {
                render: <ToastStatus status="success" transaction={hash} />,
                type: 'success',
                isLoading: false,
                autoClose: 6000,
                closeButton: true,
            });
            queryClient.invalidateQueries();
        } else {
            toast.update(toastId, {
                render: <ToastStatus status="error" transaction={hash} />,
                type: 'error',
                isLoading: false,
                autoClose: 6000,
                closeButton: true,
            });
        }
        setIsAnyTransactionLoading(false);
    };

    const updateTransaction = (hash: string, status = 'complete') => {
        const shallow = [...transactions];
        shallow.map((obj) => {
            if (obj.text === hash) return { ...obj, status };
            return obj;
        });
        setTransactions(shallow);
    };

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                setTransactions,
                newTransaction,
                updateTransaction,
                isAnyTransactionLoading,
            }}
        >
            {props.children}
        </TransactionsContext.Provider>
    );
}

// Independent
export function useTransactionsContext() {
    return useContext(TransactionsContext);
}

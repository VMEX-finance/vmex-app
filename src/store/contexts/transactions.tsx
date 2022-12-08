import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ToastStatus } from '../../ui/components/statuses';

// Types
type ITransactionProps = {
    text: string;
    status: 'pending' | 'complete' | 'error';
    onClick?: any;
};

export type ITransactionsStoreProps = {
    transactions: Array<ITransactionProps>;
    setTransactions?: any;
    newTransaction: (hash: string) => void;
    updateTransaction: (hash: string, status: string) => void;
};

// Context
const TransactionsContext = createContext<ITransactionsStoreProps>({
    transactions: [],
    newTransaction(hash) {},
    updateTransaction(hash, status) {},
});

// Wrapper
export function TransactionsStore(props: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Array<ITransactionProps>>([]);

    // For mocking data
    useEffect(() => {
        const interval = setInterval(() => {
            const shallow = [...transactions];
            const completed = shallow.map((obj) => ({ ...obj, status: 'complete' }));
            setTransactions(completed as any);
        }, 10000);

        return () => clearInterval(interval);
    }, [transactions]);

    const newTransaction = (hash: string) => {
        if (!hash) return;
        const shallow = [...transactions];
        shallow.push({ text: hash, status: 'pending' });
        setTransactions(shallow);

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 10000)), // TODO: make this reactive to ACTUALLY show when transaction in completed
            {
                pending: {
                    render() {
                        return <ToastStatus status="pending" transaction={hash} />;
                    },
                },
                error: {
                    render({ data }) {
                        return <ToastStatus status="error" transaction={hash} />;
                    },
                },
                success: {
                    render({ data }) {
                        return <ToastStatus status="success" transaction={hash} />;
                    },
                },
            },
            { delay: 200 },
        );
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

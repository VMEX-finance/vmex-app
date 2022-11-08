import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types
type ITransactionProps = {
    text: string;
    status: 'pending' | 'complete' | 'error';
    onClick?: any;
};

export type ITransactionsStoreProps = {
    transactions: Array<ITransactionProps>;
    setTransactions?: any;
    newTransaction?: any;
    updateTransaction?: any;
};

// Context
const TransactionsContext = createContext<ITransactionsStoreProps>({
    transactions: [],
});

// Wrapper
export function TransactionsStore(props: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Array<ITransactionProps>>([]);

    const newTransaction = (hash: string) => {
        const shallow = [...transactions];
        shallow.push({ text: hash, status: 'pending' });
        setTransactions(shallow);
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

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
export type IPricesStoreProps = {
    prices?: any;
    setPrices?: any;
    updatePrice?: any;
};

// Context
const PricesContext = createContext<IPricesStoreProps>({});

// Wrapper
export function PricesStore(props: { children: ReactNode }) {
    const [prices, setPrices] = useState({});

    const updatePrice = (key: string, val: any) => {
        setPrices({
            ...prices,
            [key]: val,
        });
    };

    useEffect(() => {}, []);

    return (
        <PricesContext.Provider
            value={{
                updatePrice,
                prices,
                setPrices,
            }}
        >
            {props.children}
        </PricesContext.Provider>
    );
}

// Independent
export function usePricesContext() {
    return useContext(PricesContext);
}

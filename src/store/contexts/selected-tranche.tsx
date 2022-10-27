import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types
export type ISelectedTrancheStoreProps = {
    tranche?: any;
    setTranche?: any;
    updateTranche?: any;
    asset?: string;
    setAsset?: any;
    clearTranche?: any;
    // TODO: Establish what else is required for selected tranche
};

// Context
const SelectedTrancheContext = createContext<ISelectedTrancheStoreProps>({});

// Wrapper
export function SelectedTrancheStore(props: { children: ReactNode }) {
    const [tranche, setTranche] = useState({});
    const [asset, setAsset] = useState('');

    const updateTranche = (key: string, val: any) => {
        setTranche({
            ...tranche,
            [key]: val,
        });
    };

    const clearTranche = () => {
        setTranche({});
        setAsset('');
    };

    return (
        <SelectedTrancheContext.Provider
            value={{
                tranche,
                setTranche,
                updateTranche,
                asset,
                setAsset,
                clearTranche,
            }}
        >
            {props.children}
        </SelectedTrancheContext.Provider>
    );
}

// Independent
export function useSelectedTrancheContext() {
    return useContext(SelectedTrancheContext);
}

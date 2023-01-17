import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Types
export type ISelectedTrancheStoreProps = {
    tranche?: any;
    setTranche?: any;
    updateTranche?: any;
    asset?: string;
    setAsset?: any;
    clearTranche?: any;
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

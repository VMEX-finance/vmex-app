import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ISupplyStoreProps = {
    view?: string;
    setView?: any;
    newView?: any;
    updateView?: any;
};

// Context
const SupplyContext = createContext<ISupplyStoreProps>({});

export function SelectedSupplyStore(props: { children: ReactNode }) {
    const [view, setView] = useState('');

    const updateView = (val: string) => {
        setView(val);
    };

    const clearView = () => {
        setView('');
    };

    return (
        <SupplyContext.Provider
            value={{
                view,
                setView,
            }}
        >
            {props.children}
        </SupplyContext.Provider>
    );
}

// Independent
export function useSupplyContext() {
    return useContext(SupplyContext);
}

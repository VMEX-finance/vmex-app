import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types
type IMyTrancheProps = {
    id: number;
    name: string;
    adminFee: string;
    whitelisted: string[];
    blacklisted: string[];
    tokens: string[];
    pausedTokens?: string[];
};

export type ITranchesStoreProps = {
    myTranches: Array<IMyTrancheProps>;
    setMyTranches?: any;
    newTranche?: any;
    updateTranche?: any;
    deleteTranche?: any;
    error?: string;
};

// Context
const TranchesContext = createContext<ITranchesStoreProps>({
    myTranches: [],
});

// Wrapper
export function MyTranchesStore(props: { children: ReactNode }) {
    const [myTranches, setMyTranches] = useState<Array<IMyTrancheProps>>([]);
    const [error, setError] = useState('');

    // TODO: push this new tranche to mock tranches
    const newTranche = ({ name, whitelisted, blacklisted, tokens, adminFee }: IMyTrancheProps) => {
        const shallow = myTranches.length !== 0 ? [...myTranches] : [];
        if (myTranches.length !== 0 && myTranches.find((obj) => obj.name === name)) {
            setError('Name is taken.');
            return;
        } else {
            if (error) setError('');
        }
        shallow.push({ id: shallow.length, name, whitelisted, blacklisted, tokens, adminFee });
        setMyTranches(shallow);
    };

    const updateTranche = ({
        id,
        name,
        whitelisted,
        blacklisted,
        tokens,
        pausedTokens,
        adminFee,
    }: IMyTrancheProps) => {
        const shallow = [...myTranches];
        const index = shallow.findIndex((el) => el.id === id);
        if (index || index === 0) {
            shallow[index].name = name;
            shallow[index].whitelisted = whitelisted;
            shallow[index].blacklisted = blacklisted;
            shallow[index].tokens = tokens;
            shallow[index].pausedTokens = pausedTokens;
            shallow[index].adminFee = adminFee;
            setMyTranches(shallow);
        }
    };

    const deleteTranche = (id: number) => {
        if (id || id === 0) {
            if (myTranches.length === 1) {
                setMyTranches([]);
                return;
            }
            const shallow = [...myTranches];
            const index = shallow.findIndex((el) => el.id === id);
            shallow.splice(index, index);
            setMyTranches(shallow);
        }
    };

    return (
        <TranchesContext.Provider
            value={{
                myTranches,
                setMyTranches,
                newTranche,
                updateTranche,
                deleteTranche,
                error,
            }}
        >
            {props.children}
        </TranchesContext.Provider>
    );
}

// Independent
export function useMyTranchesContext() {
    return useContext(TranchesContext);
}

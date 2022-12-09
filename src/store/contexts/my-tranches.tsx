import { useTranchesData } from '../../api';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ITrancheProps } from '@app/api/models';

// Types
type IMyTrancheProps = {
    id: number;
    name: string;
    adminFee: string;
    whitelisted: string[];
    blacklisted: string[];
    tokens: string[];
    pausedTokens?: string[];
    lendAndBorrowTokens?: string[];
    collateralTokens?: string[];
    isPaused?: boolean;
};

export type ITranchesStoreProps = {
    myTranches: Array<IMyTrancheProps>;
    setMyTranches?: any;
    newTranche?: any;
    updateTranche?: any;
    deleteTranche?: any;
    error?: string;
    pauseTranche?: any;
};

// Context
const TranchesContext = createContext<ITranchesStoreProps>({
    myTranches: [],
});

// Wrapper
export function MyTranchesStore(props: { children: ReactNode }) {
    const { address } = useAccount();
    const { queryAllTranches } = useTranchesData();
    const [myTranches, setMyTranches] = useState<Array<IMyTrancheProps>>([]);
    const [error, setError] = useState('');

    console.log(queryAllTranches.data);

    const newTranche = ({
        name,
        whitelisted,
        blacklisted,
        tokens,
        adminFee,
        lendAndBorrowTokens,
        collateralTokens,
    }: IMyTrancheProps) => {
        const shallow = myTranches.length !== 0 ? [...myTranches] : [];
        if (myTranches.length !== 0 && myTranches.find((obj) => obj.name === name)) {
            setError('Name is taken.');
            return;
        } else {
            if (error) setError('');
        }
        shallow.push({
            id: shallow.length,
            name,
            whitelisted,
            blacklisted,
            tokens,
            adminFee,
            lendAndBorrowTokens,
            collateralTokens,
        });
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
        lendAndBorrowTokens,
        collateralTokens,
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
            shallow[index].lendAndBorrowTokens = lendAndBorrowTokens;
            shallow[index].collateralTokens = collateralTokens;
            setMyTranches(shallow);
        }
    };

    const pauseTranche = (id: number) => {
        if (id || id === 0) {
            const shallow = [...myTranches];
            const index = shallow.findIndex((el) => el.id === id);
            shallow[index].isPaused = !shallow[index].isPaused;
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

    useEffect(() => {
        if (queryAllTranches.data) {
            const shallow: any[] = [];
            queryAllTranches.data.map((el) => {
                if (el.admin === address)
                    shallow.push({
                        id: Number(el.id),
                        name: el.name,
                        whitelisted: [], // TODO: fix this
                        blacklisted: [], // TODO: fix this
                        tokens: el.assets,
                        adminFee: el.adminFee.toString(),
                        lendAndBorrowTokens: [], // TODO: fix this
                        collateralTokens: [], // TODO: fix this
                    });
            });
            setMyTranches(shallow);
        }
    }, [queryAllTranches.data]);

    return (
        <TranchesContext.Provider
            value={{
                myTranches,
                setMyTranches,
                newTranche,
                updateTranche,
                deleteTranche,
                error,
                pauseTranche,
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

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { DEFAULT_NETWORK } from '../utils/network';
import { getNetwork } from '@wagmi/core';

// Types
export type IGlobalStoreProps = {
    isAuthenticated?: boolean;
    currentNetwork: string;
    firstLoad: boolean;
    setFirstLoad: any;
};

// Context
const GlobalContext = createContext<IGlobalStoreProps>({
    isAuthenticated: false,
    currentNetwork: DEFAULT_NETWORK,
    firstLoad: false,
    setFirstLoad: () => {},
});

// Wrapper
export function GlobalStore(props: { children: ReactNode }) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
    const { address } = useAccount();
    const [oldChain, setOldChain] = useState(network);
    const [firstLoad, setFirstLoad] = useState(true);
    useSwitchNetwork(); // for some reason, it reloads page on chain change with this hook

    // useEffect(() => {
    //     if (address) {
    //         const hexProof = merkle.tree.getHexProof(merkle.padBuffer(address));
    //         if (hexProof.length && location.pathname === '/beta-auth') {
    //             setIsAuthenticated(true);
    //             navigate('/overview');
    //         }
    //     }
    // }, [address]);

    useEffect(() => {
        if (network && address && oldChain !== network) {
            setOldChain(network);
            window.location.reload();
        }
    }, [network]);

    useEffect(() => {
        if (!firstLoad) setFirstLoad(true);
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                currentNetwork: network,
                firstLoad,
                setFirstLoad,
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
}

// Independent
export function useGlobalContext() {
    return useContext(GlobalContext);
}

// Protected Routes
export const ProtectedRoute = ({ children }: any) => {
    // const { isAuthenticated } = useGlobalContext();
    // if (!isAuthenticated) {
    //     // user is not authenticated
    //     return <Navigate to="/beta-auth" />;
    // }
    return children;
};

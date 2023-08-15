import { useLocalStorage } from '../hooks';
import { useMerkle } from '../utils/merkle';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

// Types
export type IAuthStoreProps = {
    isAuthenticated?: boolean;
};

// Context
const AuthContext = createContext<IAuthStoreProps>({});

// Wrapper
export function AuthStore(props: { children: ReactNode }) {
    const { address } = useAccount();
    const merkle = useMerkle();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);

    useEffect(() => {
        if (address) {
            const hexProof = merkle.tree.getHexProof(merkle.padBuffer(address));
            if (hexProof.length && location.pathname === '/beta-auth') {
                setIsAuthenticated(true);
                navigate('/overview');
            }
        }
    }, [address]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

// Independent
export function useAuthContext() {
    return useContext(AuthContext);
}

// Protected Routes
export const ProtectedRoute = ({ children }: any) => {
    const { isAuthenticated } = useAuthContext();
    if (!isAuthenticated) {
        // user is not authenticated
        return <Navigate to="/beta-auth" />;
    }
    return children;
};

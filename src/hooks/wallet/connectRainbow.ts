import React from 'react';
import { loginWithRainbow, IWalletState } from '../../store/rainbow';
import { useAppSelector, useAppDispatch } from '../redux';

type IUseWalletStateProps = {
    provider: any;
    address: string;
    signer: any;
    isLoading: boolean;
    error: any;
    connectRainbow: (e: any) => void;
};

export function useWalletState2(): IUseWalletStateProps {
    const { provider, address, signer, isLoading, error } = useAppSelector<any>(
        (state) => state.wallet,
    );
    const dispatch = useAppDispatch();

    function connectRainbow(e: any): void {
        e.preventDefault();
        dispatch(loginWithRainbow());
    }

    return { provider, address, signer, isLoading, error, connectRainbow };
}

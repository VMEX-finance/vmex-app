import React from "react";
import { loginWithMetamask, IWalletState } from "../store/wallet";
import { useAppSelector, useAppDispatch } from "./redux";

export function useWalletState(): any {
    const {
        provider,
        address,
        signer,
        isLoading,
        error
    } = useAppSelector<any>((state) => state.wallet);
    const dispatch = useAppDispatch();

    function connectMetamask(e: any): void {
        e.preventDefault();
        dispatch(loginWithMetamask())
    }

    return { provider, address, signer, isLoading, error, connectMetamask }

}


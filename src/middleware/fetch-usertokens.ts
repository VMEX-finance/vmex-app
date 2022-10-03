import React from 'react';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
// import { getUserTokenBalances } from "vmex-sdk/dist/src.ts/analytics";
import { refreshUserTokenList } from '../store/user-tokenBal';
import { PayloadAction } from '@reduxjs/toolkit';

/**
 * Fetches user token balances from vmex-sdk
 * @param storeAPI
 * @returns { response: Pick<[name: string] => string>}
 */
export const fetchUserTokensMW =
    (storeAPI: any) => (next: any) => async (action: PayloadAction<any>) => {
        if (action.type === 'connect_metamask/fulfilled') {
            // const { response } = await getUserTokenBalances(action.payload.signer)
            // storeAPI.dispatch(refreshUserTokenList(response))
        }

        return next(action);
    };

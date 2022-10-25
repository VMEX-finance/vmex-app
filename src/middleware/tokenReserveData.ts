import React from 'react';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import setUserTokenData from '../store/token-data';
import { PayloadAction } from '@reduxjs/toolkit';
// import { getTokenReserveData } from 'vmex/dist/src.ts/analytics';

export const refreshTokenReserveList =
    (storeAPI: any) => (next: any) => async (action: PayloadAction<any>) => {
        if (action.type === 'connect_metamask/fulfilled') {
            // const data = await getTokenReserveData(action.payload.signer)
        }

        return next(action);
    };

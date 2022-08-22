import React from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { getUserTokenBalances } from "vmex-sdk/dist/src.ts/analytics";


export const fetchUserTokensMW = (storeAPI: any) => (next: any) => async (action: any) => {
    if (action.type === "connect_metamask/fulfilled") {
        // fetches userTokenBalances from vmex-sdk
        const { response } = await getUserTokenBalances(action.payload.signer)
    };

    return next(action);
}


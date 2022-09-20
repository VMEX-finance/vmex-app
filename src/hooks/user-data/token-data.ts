import React from "react";
import { useAppSelector, useAppDispatch } from "../redux";
import { setUserTokenData } from "../../store/token-data";
import { getTokenReserveData } from "vmex/dist/src.ts/analytics";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ITokenData } from "@store/token-data";

export async function useGeneralTokenData() {
    const { 
        isLoading,
        error,
        error_msg,
        data,
    }: ITokenData = useAppSelector<any>((state) => (state as any).token_data);
    const dispatch = useAppDispatch();

    React.useEffect(() => {

        (async () => {
            const provider = new JsonRpcProvider("http://127.0.0.1:8545");
            const signer = provider.getSigner();
            let response = await getTokenReserveData(signer);
            dispatch(setUserTokenData({data: response}))
        })()
        
        return () => {}
    }, [])
}
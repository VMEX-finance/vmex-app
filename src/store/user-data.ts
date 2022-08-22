import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserTokenBalances } from "vmex-sdk/dist/src.ts/analytics";

export interface IUserDataSlice {
    isLoading: boolean;
    error?: boolean;
    error_msg?: string;

}


export const initialTokenList: IUserDataSlice = {
    isLoading: true
}


export const refreshUserTokenList = createAsyncThunk(
    "refresh_tokenList",
    async (data, thunkAPI) =>{
        if (!(data as any).provider) return;
        const { response } = await getUserTokenBalances((data as any).provider)
        console.log(response)
        return response
    }
)

export const UserTokenSlice = createSlice({
    name: "user_tokens",
    initialState: initialTokenList,
    reducers: {

    },
    extraReducers: (builder) => {

        builder.addCase(refreshUserTokenList.fulfilled, (state, action) => {
            console.log(action.payload)
        })

        builder.addCase(refreshUserTokenList.rejected, (state, action) => {
            console.log("failed for some reason, add proper error handling please")
        })
    }
});


export default UserTokenSlice.reducer;

export {};
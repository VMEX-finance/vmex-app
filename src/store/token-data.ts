import React from "react";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



export interface ITokenData {
    isLoading: boolean,
    error?: boolean,
    error_msg?: string,
    data?: any
}
const InitialTokenState: ITokenData = {
    isLoading: true
}

export const TokenDataSlice = createSlice({
    name: "token_data",
    initialState: InitialTokenState,
    reducers: {
        setUserTokenData: (state, action: PayloadAction<any>) => {
            state.data = action.payload.data;
            state.isLoading = false;
        }
    }
})

export const { setUserTokenData } = TokenDataSlice.actions;
export default TokenDataSlice.reducer;
import React from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getUserTokenBalances } from "vmex-sdk/dist/src.ts/analytics";

export interface IUserDataSlice {
    isLoading: boolean;
    error?: boolean;
    error_msg?: string;
    data?: any;
}

export const initialTokenList: IUserDataSlice = {
    isLoading: true,
};

export const refreshUserTokenList = createAsyncThunk(
    'refresh_tokenList',
    async (data: any, thunkAPI) => {
        console.log(data);
        return data;
    },
);

export const UserTokenSlice = createSlice({
    name: 'user_tokens',
    initialState: initialTokenList,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(refreshUserTokenList.fulfilled, (state, action) => {
            state.data = action.payload;
            state.isLoading = false;
        });

        builder.addCase(refreshUserTokenList.rejected, (state, action) => {
            console.log('failed for some reason, add proper error handling please');
        });
    },
});

export default UserTokenSlice.reducer;

import React from "react";
import { Provider } from "react-redux";
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import WalletSlice, {type IWalletState } from "./wallet";
import DialogControllerSlice, { type IDialogState, DialogType } from "./modals";
import UserTokenSlice from "./user-tokenBal";
import { enableMapSet } from "immer";
import { fetchUserTokensMW } from "../middleware/fetch-usertokens";
window.Buffer = window.Buffer || require("buffer").Buffer;

enableMapSet()

export const Store = configureStore({
    reducer: {
        wallet: WalletSlice,
        dialogs: DialogControllerSlice,
        user_tokens: UserTokenSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fetchUserTokensMW)
})

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

const ReduxProvider = ({children}: React.PropsWithChildren) => {
    return (
        <Provider store={Store}>
            {children}
        </Provider>
    )
}

export default ReduxProvider;
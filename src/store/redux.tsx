import React from "react";
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import WalletSlice, {type IWalletState } from "./wallet";
import DialogControllerSlice, { type IDialogState, DialogType } from "./modals";
import { enableMapSet } from "immer";
window.Buffer = window.Buffer || require("buffer").Buffer;

enableMapSet()

export const Store = configureStore({
    reducer: {
        wallet: WalletSlice,
        dialogs: DialogControllerSlice
    }
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
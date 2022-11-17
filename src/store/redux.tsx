import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import WalletSlice from './wallet';
import DialogControllerSlice from './modals';
import UserTokenSlice from './user-tokenBal';
import TokenDataSlice from './token-data';
import { enableMapSet } from 'immer';
window.Buffer = window.Buffer || require('buffer').Buffer;

enableMapSet();

export const Store = configureStore({
    reducer: {
        wallet: WalletSlice,
        dialogs: DialogControllerSlice,
        user_tokens: UserTokenSlice,
        token_data: TokenDataSlice,
    },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

const ReduxProvider = ({ children }: React.PropsWithChildren) => {
    return <Provider store={Store}>{children}</Provider>;
};

export default ReduxProvider;

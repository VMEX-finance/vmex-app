import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DialogType = {
    name?: string;
    isOpen?: boolean;
    data?: any;
    isError?: boolean;
    isSuccess?: boolean;
};

export interface IDialogState {
    dialogs?: Map<string, DialogType>;
    isLoading?: boolean;
    error?: null | string;
}

const DialogControllerState: IDialogState = {
    dialogs: new Map<string, DialogType>([
        [
            'loan-asset-dialog',
            {
                name: 'Supply',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'borrowed-asset-details-dialog',
            {
                name: 'Borrowed Asset Details',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'borrow-asset-dialog',
            {
                name: 'Borrow',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'stake-asset-dialog',
            {
                name: 'Stake',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
    ]),
};

export const DialogControllerSlice = createSlice({
    name: 'dialog-controller',
    initialState: DialogControllerState,
    reducers: {
        setDataAndOpen: (state, action: PayloadAction<any>) => {
            state.dialogs?.set(action.payload.id, {
                ...state.dialogs?.get(action.payload.id),
                data: action.payload.data,
                isOpen: true,
            });
        },

        clearAndClose: (state, action: PayloadAction<any>) => {
            state.dialogs?.set(action.payload.id, {
                ...state.dialogs?.get(action.payload.id),
                data: {},
                isOpen: false,
            });
        },
    },
});

export const { setDataAndOpen, clearAndClose } = DialogControllerSlice.actions;
export default DialogControllerSlice.reducer;

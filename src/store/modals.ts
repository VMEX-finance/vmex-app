import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DialogType = {
    name?: string;
    tab?: string;
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

export type IDialogNames =
    | 'loan-asset-dialog'
    | 'borrow-asset-dialog'
    | 'stake-asset-dialog'
    | 'my-tranches-dialog'
    | 'create-tranche-dialog'
    | 'confirmation-dialog'
    | 'feedback-dialog'
    | 'disclaimer-dialog'
    | 'toggle-collateral-dialog'
    | 'transactions-dialog'
    | 'referrals-dialog';

const DialogControllerState: IDialogState = {
    dialogs: new Map<string, DialogType>([
        [
            'loan-asset-dialog',
            {
                name: 'Supply',
                tab: 'Withdraw',
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
                tab: 'Repay',
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
        [
            'my-tranches-dialog',
            {
                name: 'My Tranches',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'create-tranche-dialog',
            {
                name: 'Create Tranche',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'confirmation-dialog',
            {
                name: 'Confirmation',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'feedback-dialog',
            {
                name: 'Feedback',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'disclaimer-dialog',
            {
                name: 'Disclaimer',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'toggle-collateral-dialog',
            {
                name: 'Collateral',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'transactions-dialog',
            {
                name: 'Transaction History',
                isOpen: false,
                data: {},
                isSuccess: false,
                isError: false,
            },
        ],
        [
            'referrals-dialog',
            {
                name: 'Referrals',
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

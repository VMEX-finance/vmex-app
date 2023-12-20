import { useTransactionsContext } from '../store';
import React, { useState } from 'react';
import { IDialogNames } from '../store/modals';
import { TIMER_CLOSE_DELAY } from '../utils/constants';
import { useDialogController } from '.';
import { useMediatedState } from 'react-use';
import { inputMediator } from '../utils/helpers';

export type IUseModal = {
    isSuccess: boolean;
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    submitTx: (callback?: any, close?: boolean) => Promise<void>;
    dialog: IDialogNames;
    view: string;
    setView: React.Dispatch<React.SetStateAction<string>>;
    isMax: boolean;
    setIsMax: React.Dispatch<React.SetStateAction<boolean>>;
    amount: string;
    setAmount: React.Dispatch<React.SetStateAction<string>>;
};

export const useModal = (dialog?: IDialogNames): IUseModal => {
    const determineDefaultView = () => {
        switch (dialog) {
            case 'leverage-asset-dialog':
                return 'Loop';
            case 'loan-asset-dialog':
                return 'Supply';
            case 'borrow-asset-dialog':
                return 'Borrow';
            case 'vault-asset-dialog':
                return 'Deposit';
            default:
                return 'Modal';
        }
    };

    const determineTxType = () => {
        switch (dialog) {
            case 'loan-asset-dialog':
                return 'Deposit';
            case 'borrow-asset-dialog':
                return 'Borrow';
            case 'leverage-asset-dialog':
                return 'Loop';
            default:
                return undefined;
        }
    };

    const { newTransaction } = useTransactionsContext();
    const { closeDialog } = useDialogController();

    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [view, setView] = useState(determineDefaultView());
    const [isMax, setIsMax] = useState(false);
    const [amount, setAmount] = useMediatedState(inputMediator, '');

    const submitTx = async (callback?: any, close = true) => {
        if (!error) {
            setIsLoading(true);
            try {
                if (callback) {
                    const tx = await callback();
                    newTransaction(tx, determineTxType());
                }

                setIsLoading(false);
                setError('');
                setIsSuccess(true);

                setTimeout(() => {
                    setIsSuccess(false);
                    close && dialog && closeDialog(dialog);
                }, TIMER_CLOSE_DELAY);
            } catch (err) {
                console.error('Error in submitting tx:', err);
                setError(String(err));
                setIsSuccess(false);
                if (String(err)?.includes('user rejected')) setTimeout(() => setError(''), 2000);
            }
            setIsLoading(false);
        }
    };

    return {
        isSuccess,
        setIsSuccess,
        isLoading,
        setIsLoading,
        error,
        setError,
        submitTx,
        dialog: dialog || 'tos-dialog',
        view,
        setView,
        isMax,
        setIsMax,
        amount,
        setAmount,
    };
};

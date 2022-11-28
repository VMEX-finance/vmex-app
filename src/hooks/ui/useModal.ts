import { useTransactionsContext } from '../../store/contexts';
import { Dispatch, SetStateAction, useState } from 'react';
import { IDialogNames } from '../../store/modals';
import { TIMER_CLOSE_DELAY } from '../../utils/constants';
import { useDialogController } from '../../hooks/dialogs';

type IUseModalProps = {
    isSuccess: boolean;
    setIsSuccess: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    error: string;
    setError: Dispatch<SetStateAction<string>>;
    submitTx: (callback?: any, close?: boolean) => Promise<void>;
};

export const useModal = (dialog: IDialogNames): IUseModalProps => {
    const { newTransaction } = useTransactionsContext();
    const { closeDialog } = useDialogController();

    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const submitTx = async (callback?: any, close = true) => {
        if (!error) {
            setIsLoading(true);
            try {
                newTransaction(
                    `0xAz${Math.floor(Math.random() * 9)}...${Math.floor(
                        Math.random() * 9,
                    )}${Math.floor(Math.random() * 9)}`,
                );
                if (callback) {
                    const res = await callback();
                    console.log('CALLBACK RESPONSE:', res);
                }

                setIsLoading(false);
                setError('');
                setIsSuccess(true);

                setTimeout(() => {
                    setIsSuccess(false);
                    close && closeDialog(dialog);
                }, TIMER_CLOSE_DELAY);
            } catch (err) {
                setError(String(err));
                setIsSuccess(false);
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
    };
};

import { useAppSelector, useAppDispatch } from './redux';
import {
    clearAndClose,
    setDataAndOpen,
    IDialogState,
    IDialogNames,
    DialogType,
} from '../store/modals';
import { useNetwork } from 'wagmi';
import { isChainUnsupported } from '@/utils';

export const useDialogController = () => {
    const { chain } = useNetwork();
    const { dialogs, isLoading, error }: IDialogState = useAppSelector<any>(
        (state) => state.dialogs,
    );
    const dispatch = useAppDispatch();

    function openDialog(e: IDialogNames, data?: any) {
        if (isChainUnsupported() && e !== 'feedback-dialog') return;
        dispatch(setDataAndOpen({ data: data, id: e }));
    }

    function closeDialog(e: IDialogNames) {
        dispatch(clearAndClose({ id: e }));
    }

    function getDialogProps(id: IDialogNames): any {
        if (dialogs) {
            let data = dialogs.get(id);
            return {
                ...data,
                closeDialog: closeDialog,
                showSuccess: dispatch,
            };
        } else {
            return {
                closeDialog: closeDialog,
            };
        }
    }

    return {
        openDialog,
        closeDialog,
        getDialogProps,
    };
};

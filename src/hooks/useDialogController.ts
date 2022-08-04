import React from "react";
import { useAppSelector, useAppDispatch } from "./redux";
import { clearAndClose, setDataAndOpen, IDialogState } from "../store/modals";

const useDialogController = () => {
    const {
        dialogs,
        isLoading,
        error,
    }: IDialogState = useAppSelector<any>((state) => state.dialogs);
    const dispatch = useAppDispatch();

    function openDialog(e: string, data: any) {
        dispatch(setDataAndOpen({data: data, id: e}))
    }

    function closeDialog(e: string) {
        dispatch(clearAndClose({id: e}))
    }

    function getDialogProps(id: string){
        if (dialogs) {
            let data = dialogs.get(id)
            return {
                ...data,
                closeDialog: closeDialog
            }
        } else {
            return {
                closeDialog: closeDialog
            }
        }
    }

    return {
        openDialog,
        closeDialog,
        getDialogProps,
    }
}

export default useDialogController;
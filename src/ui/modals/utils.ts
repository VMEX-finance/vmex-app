export type IDialogProps = {
    name?: string;
    isOpen?: boolean;
    data?: any;
    tab?: string;
    closeDialog(e: any): void;
};

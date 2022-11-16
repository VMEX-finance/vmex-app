export * from './borrow-asset';
export * from './borrowed-asset-details';
export * from './stake-asset';
export * from './supply-asset';
export * from './supplied-asset-details';
export * from './create-tranche';
export * from './my-tranches';

export type IDialogProps = {
    name?: string;
    isOpen?: boolean;
    data?: any;
    tab?: string;
    closeDialog(e: any): void;
};

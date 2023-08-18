import { BigNumber } from 'ethers';

export type AssetDetails = {
    asset: string;
    trancheId: number;
    view: 'Withdraw' | 'Supply';
    amountNative?: BigNumber;
    amount?: string;
    apy?: number;
    tranche?: string;
    collateral?: boolean;
};
export type ISupplyBorrowProps = {
    name?: string;
    isOpen?: boolean;
    data?: AssetDetails;
    tab?: string;
    closeDialog?(e: any): void;
};

export type IDialogProps = {
    name?: string;
    isOpen?: boolean;
    data?: any;
    tab?: string;
    closeDialog?(e: any): void;
};

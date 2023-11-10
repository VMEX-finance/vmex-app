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

export type LeverageDetails = {
    asset: string;
    trancheId: number;
    tranche?: string;
    amountNative?: BigNumber;
    amount: string;
    collateral: string;
    suppliedAssetDetails: any;
    leverage: number;
    totalApy: string;
};

export type ILeverageProps = {
    name?: string;
    data?: LeverageDetails;
    tab?: string;
    closeDialog?(e: any): void;
};

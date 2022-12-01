import { UseQueryResult } from '@tanstack/react-query';
import { IUserPerformanceCardProps } from '@ui/features';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '@ui/tables';

export type IUserDataProps = {
    queryUserPerformance: UseQueryResult<IUserPerformanceCardProps, unknown>;
    queryUserActivity: UseQueryResult<IUserActivityDataProps, unknown>;
    queryUserWallet: UseQueryResult<IUserWalletDataProps, unknown>;
};

export type IUserActivityDataProps = {
    supplies: IYourSuppliesTableItemProps[];
    borrows: IYourBorrowsTableItemProps[];
};

export type IWalletAssetProps = {
    asset: string;
    amount: string;
};

export type IUserWalletDataProps = {
    assets: IWalletAssetProps[];
};

export type IUserTrancheDataProps = {
    queryUserTrancheData: UseQueryResult<IUserTrancheData, unknown>;
};

export type IUserTrancheData = {
    // totalCollateralETH: string;
    // totalDebtETH: string;
    // availableBorrowsETH: string;
    // currentLiquidationThreshold: string;
    // ltv: string;
    healthFactor: string;
    // supplies: IYourSuppliesTableItemProps[];
    // borrows: IYourBorrowsTableItemProps[];
    assetBorrowingPower: IAvailableBorrowData[];
};

export type IAvailableBorrowData = {
    asset: string;
    amountUSD: string;
    amountNative: string;
};

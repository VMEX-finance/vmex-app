import { UseQueryResult } from '@tanstack/react-query';
import { IUserPerformanceCardProps } from '@ui/features';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '@ui/tables';
import { BigNumber } from 'ethers';

type ITokenBalanceProps = {
    amount: string;
    amountNative: string;
};

export type IUserDataProps = {
    queryUserPerformance: UseQueryResult<IUserPerformanceCardProps, unknown>;
    queryUserActivity: UseQueryResult<IUserActivityDataProps, unknown>;
    queryUserWallet: UseQueryResult<IUserWalletDataProps, unknown>;
    getTokenBalance: (asset: string) => ITokenBalanceProps;
};

export type IUserActivityDataProps = {
    supplies: IYourSuppliesTableItemProps[];
    borrows: IYourBorrowsTableItemProps[];
    totalCollateralETH: string;
    totalDebtETH: string;
    availableBorrowsETH: string;
};

export type IWalletAssetProps = {
    asset: string;
    amount: string;
    amountNative: string;
    currentPrice: BigNumber; //18 decimals
};

export type IUserWalletDataProps = {
    assets: IWalletAssetProps[];
};

export type IUserTrancheDataProps = {
    queryUserTrancheData: UseQueryResult<IUserTrancheData, unknown>;
};

export type IUserTrancheData = {
    totalCollateralETH: BigNumber;
    totalDebtETH: BigNumber;
    // availableBorrowsETH: string;
    currentLiquidationThreshold: BigNumber;
    // ltv: string;
    healthFactor: string;
    supplies: IYourSuppliesTableItemProps[];
    borrows: IYourBorrowsTableItemProps[];
    assetBorrowingPower: IAvailableBorrowData[];
};

export type IAvailableBorrowData = {
    asset: string;
    amountUSD: string;
    amountNative: string;
};

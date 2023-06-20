import { UseQueryResult } from '@tanstack/react-query';
import { IUserPerformanceCardProps } from '@ui/features';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '@ui/tables';
import { BigNumber } from 'ethers';
import { UserRewards } from '@vmexfinance/sdk';
import { VmexRewardsData } from '../types';

type ITokenBalanceProps = {
    amount: string;
    amountNative: BigNumber;
    loading?: boolean;
};

export type ITrancheInteractedProps = {
    tranche: string;
    id: number;
};

export type IUserDataProps = {
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
    tranchesInteractedWith: ITrancheInteractedProps[];
    avgApy: number;
};

export type IWalletAssetProps = {
    asset: string;
    amount: string;
    amountNative: BigNumber;
    currentPrice: BigNumber; //18 decimals
};

export type IUserWalletDataProps = {
    assets: IWalletAssetProps[];
};

export type IUserTrancheDataProps = {
    queryUserTrancheData: UseQueryResult<IUserTrancheData, unknown>;
    queryUserRewardsData: UseQueryResult<UserRewards, unknown>;
    queryRewardsData: UseQueryResult<VmexRewardsData[], unknown>;
    findAssetInUserSuppliesOrBorrows: (
        asset: string | undefined,
        type: 'supply' | 'borrow',
    ) => IYourSuppliesTableItemProps | IYourBorrowsTableItemProps | undefined;
    findAmountBorrowable: (
        asset: string,
        liquidityNative: BigNumber | undefined,
        decimals: string | undefined,
        price: BigNumber | undefined,
    ) => ITokenBalanceProps;
    findAssetInRewards: (
        asset: string | undefined,
        tranche: string | undefined,
        type: 'supply' | 'borrow',
    ) => boolean;
};

export type IUserTranchesDataProps = {
    queryUserTranchesData: UseQueryResult<IUserTrancheData[], unknown>;
};

export type IUserTrancheData = {
    totalCollateralETH: BigNumber;
    totalDebtETH: BigNumber;
    // availableBorrowsETH: string;
    currentLiquidationThreshold: BigNumber;
    // ltv: string;
    healthFactor: string;
    avgBorrowFactor: BigNumber;
    supplies: IYourSuppliesTableItemProps[];
    borrows: IYourBorrowsTableItemProps[];
    assetBorrowingPower: IAvailableBorrowData[];
    trancheId: number;
};

export type IAvailableBorrowData = {
    asset: string;
    amountUSD: string;
    amountNative: BigNumber;
};

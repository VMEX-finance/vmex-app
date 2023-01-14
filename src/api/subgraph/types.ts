import { UseQueryResult } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '../../ui/components/charts';
import { AssetBalance, IMarketsAsset, ITrancheProps, TrancheData } from '../types';
import { BigNumber } from 'ethers';
export type IAssetData = {
    underlyingAssetName: string;
};

export type IGraphHistoryProps = {
    action?: 'Borrow' | 'Deposit';
    amount: BigNumber;
    timestamp: number;
    reserve: {
        decimals: number;
        assetData: IAssetData;
        name?: string;
    };
};

export type IGraphTrancheProps = {
    id: string;
    borrowHistory: IGraphHistoryProps[];
    depositHistory: IGraphHistoryProps[];
};

export type IGraphAssetData = {
    liquidity: BigNumber;
    decimals: string;
    ltv: string;
    optimalUtilityRate: number;
    reserveFactor: string;
    vmexReserveFactor: string;
    liquidationThreshold: string;
    totalBorrowed: string;
    utilityRate: string;
    borrowRate: string;
    supplyRate: string;
    collateral: boolean;
    canBeBorrowed: boolean;
    oracle: string;
    totalSupplied: string;
    baseLTV: string;
    liquidationBonus: string;
    borrowFactor: string;
    borrowCap: string;
    supplyCap: string;
    priceUSD: BigNumber;
    priceETH: BigNumber;
    yieldStrategy: string;
};

export type IGraphTrancheAssetProps = IGraphAssetData | Record<any, any>;

export type IGraphTrancheDataProps = {
    assetsData?: IGraphTrancheAssetProps;
    utilityRate?: string;
    availableLiquidity?: string;
    totalSupplied?: string;
    totalBorrowed?: string;
    assets?: string[];
    whitelist?: boolean;
    admin?: string;
    aggregateRating?: string;
    tvl?: string;
    tvlChange?: number;
    supplyChange?: number;
    borrowChange?: number;
    name?: string;
    id?: string;
    poolUtilization?: string;
};

export type IGraphProtocolDataProps =
    | {
          tvl: string;
          reserve: string;
          totalSupplied: string;
          totalBorrowed: string;
          uniqueLenders: string[];
          uniqueBorrowers: string[];
          markets: number;
          topBorrowedAssets: AssetBalance[];
          topSuppliedAssets: AssetBalance[];
          topTranches: TrancheData[];
      }
    | Record<any, any>;

export type IGraphUserDataProps = {} | Record<any, any>;

export type ISubgraphTrancheData = {
    queryTrancheData: UseQueryResult<IGraphTrancheDataProps, unknown>;
    findAssetInMarketsData: (asset: string) => IGraphAssetData;
};

export type ISubgraphMarketsChartsProps = {
    supplyBorrowRateChart: ILineChartDataPointProps[];
    utilizationChart: ILineChartDataPointProps[];
    yieldStrategy: string;
};
export type ISubgraphMarketsChart = {
    queryMarketsChart: UseQueryResult<ISubgraphMarketsChartsProps, unknown>;
};

export type ISubgraphAllMarketsData = {
    queryAllMarketsData: UseQueryResult<IMarketsAsset[], unknown>;
};

export type ISubgraphUserData = {
    queryUserPnlChart: UseQueryResult<ILineChartDataPointProps[], unknown>;
    queryUserData: UseQueryResult<any, unknown>;
    queryTrancheAdminData: UseQueryResult<IGraphTrancheDataProps[], unknown>;
};

export type ISubgraphTranchesDataProps = {
    queryAllTranches: UseQueryResult<ITrancheProps[], unknown>;
};

export type ISubgraphProtocolData = {
    queryProtocolTVLChart: UseQueryResult<ILineChartDataPointProps[], unknown>;
    queryProtocolData: UseQueryResult<IGraphProtocolDataProps, unknown>;
};

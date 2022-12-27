import { UseQueryResult } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '../../ui/components/charts';
import { AssetBalance, IMarketsAsset, ITrancheProps, TrancheData } from '../types';

export type IGraphHistoryProps = {
    action?: 'Borrow' | 'Deposit';
    amount: string;
    timestamp: number;
    reserve: {
        decimals: number;
        symbol: string;
        name?: string;
    };
};

export type IGraphTrancheProps = {
    id: string;
    borrowHistory: IGraphHistoryProps[];
    depositHistory: IGraphHistoryProps[];
};

export type IGraphTrancheAssetProps =
    | {
          liquidity: string;
          ltv: string;
          optimalUtilityRate: number;
          reserveFactor: string;
          liquidationThreshold: string;
          totalBorrowed: string;
          utilityRate: string;
          borrowRate: string;
          supplyRate: string;
          liquidationPenalty: string;
          collateral: boolean;
          canBeBorrowed: boolean;
          oracle: string;
          totalSupplied: string;
      }
    | Record<any, any>;

export type IGraphTrancheDataProps = {
    assetsData?: IGraphTrancheAssetProps;
    utilityRate?: string;
    availableLiquidity?: string;
    totalSupplied?: string;
    totalBorrowed?: string;
    assets?: string[];
    whitelist?: boolean;
    admin?: string;
    adminFee?: number;
    platformFee?: number;
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
};

export type ISubgraphMarketsChartsProps = {
    supplyBorrowRateChart: ILineChartDataPointProps[];
    utilizationChart: ILineChartDataPointProps[];
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
};

export type ISubgraphTranchesDataProps = {
    queryAllTranches: UseQueryResult<ITrancheProps[], unknown>;
};

export type ISubgraphProtocolData = {
    queryProtocolTVLChart: UseQueryResult<ILineChartDataPointProps[], unknown>;
    queryProtocolData: UseQueryResult<IGraphProtocolDataProps, unknown>;
};

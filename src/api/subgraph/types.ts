import { UseQueryResult } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '../../ui/components/charts';

export type IGraphHistoryProps = {
    action?: 'Borrow' | 'Deposit';
    amount: string;
    timestamp: number;
    reserve: {
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
          liquidityRate: string;
          optimalUtilityRate: number;
          reserveFactor: string;
          liquidationThreshold: string;
          totalDeposits: string;
          utilityRate: string;
          borrowRate: string;
          supplyRate: string;
          liquidationPenalty: string;
          collateral: boolean;
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
    adminFee?: string;
    platformFee?: string;
};

export type IGraphProtocolDataProps =
    | {
          uniqueLenders: string[];
          uniqueBorrowers: string[];
      }
    | Record<any, any>;

export type IGraphUserDataProps = {} | Record<any, any>;

export type ISubgraphTrancheData = {
    queryTrancheData: UseQueryResult<IGraphTrancheDataProps, unknown>;
};

export type ISubgraphUserData = {
    queryUserData: UseQueryResult<any, unknown>;
};

export type ISubgraphProtocolData = {
    queryProtocolTVLChart: UseQueryResult<ILineChartDataPointProps[], unknown>;
    queryProtocolData: UseQueryResult<IGraphProtocolDataProps, unknown>;
};

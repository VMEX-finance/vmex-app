import { BigNumber } from 'ethers';
import { UseQueryResult } from '@tanstack/react-query';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '@/ui/tables';
import { UserRewards } from '@vmexfinance/sdk';
import { IAvailableCoins } from '@/utils';
import { ILineChartDataPointProps } from '@/ui/components';

// Table of Contents:
// 1. General
// 2. User
// 3. Rewards
// 4. Prices
// 5. Subgraph

/**
 * GENERAL
 */
export type IQueryKeys =
    | 'user-tranche'
    | 'user-performance'
    | 'user-activity'
    | 'user-wallet'
    | 'all-markets'
    | 'tranche-markets'
    | 'protocol-overview'
    | 'all-tranches'
    | 'all-markets-data'
    | 'tranche-data'
    | 'protocol-charts'
    | 'protocol-data'
    | 'tranches-overview-data'
    | 'user-data'
    | 'user-pnl-chart'
    | 'asset-prices';

export type IAssetMappings = {
    asset: string;
    decimals: number;
    borrowFactor: BigNumber;
    borrowCap: BigNumber;
    baseLTV: BigNumber; // if == 0, then can not be collateral
    supplyCap: BigNumber;
    vmexReserveFactor: BigNumber;

    interestRateStrategyAddress: string;

    liquidationBonus: BigNumber;
    liqudiationThreshold: BigNumber;
    canBeBorrowed: boolean;
};

export type IMarketsAsset = {
    assetAddress?: string;
    asset: string;
    assetAddress: string;
    tranche: string;
    trancheId: number;
    supplyApy: number | string;
    borrowApy: number | string;
    available: string | number;
    availableNative: BigNumber;
    supplyTotal: number | string;
    borrowTotal: number | string;
    rating: string;
    strategies?: boolean;
    canBeCollateral: boolean;
    canBeBorrowed: boolean;
    currentPrice?: BigNumber;
    supplyCap?: BigNumber;
    liquidationThreshold: BigNumber;
};

export type ITrancheProps = {
    id?: number | string;
    name?: string;
    assets?: string[];
    aggregateRating?: string;
    yourActivity?: 'borrowed' | 'supplied' | 'both' | 'none'; // Can also be represented in another way if necessary (i.e. 1 = 'deposited', 2 = 'supplied', etc.)
    tvl?: number | string;
    tvlChange?: number;
    supplyTotal?: number | string;
    supplyChange?: number;
    borrowTotal?: number | string;
    borrowChange?: number;
    longSupply?: number | string;
    longBorrow?: number | string;
    liquidity?: number | string;
    poolUtilization?: number | string;
    upgradeable?: 'Yes' | 'No';
    admin?: string;
    platformFee?: number | string;
    adminFee?: number | string;
    oracle?: string;
    whitelist?: 'Yes' | 'No';
    liquidThreshold?: number | string;
    liquidPenalty?: number | string;
    collateral?: 'Yes' | 'No';
    statisticsSupplied?: number | string;
    statisticsBorrowed?: number | string;
    utilization?: number | string;
    reserveFactor?: number | string;
    strategy?: number | string;
    category?: ITrancheCategories;
};

export type AvailableAsset = {
    asset: string;
    amount?: number | string;
    amountNative?: BigNumber;
    apy: number | string;
    canBeCollat?: boolean;
    liquidity?: string;
    liquidityNative?: BigNumber;
    priceUSD?: BigNumber;
};

export interface AssetBalance {
    asset: string;
    amount: string;
    trancheId?: string;
    trancheName?: string;
}

export interface TrancheData {
    id: string;
    name: string;
    totalSupplied: string;
    totalBorrowed: string;
}

export interface VmexRewardsData {
    emissionsEndTimestamp: number;
    emissionsPerSecond: BigNumber;
    index: BigNumber;
    rewardToken: string;
    rewardTokenDecimals: number;
    rewardTokenSymbol: string;
    // updatedAt: number;
    trancheId: string;
    aTokenAddress: string;
    underlyingAssetAddress: string;
}

/**
 * USER
 */
export type ITokenBalanceProps = {
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

export type IUserTxHistoryProps = {
    datetime: Date;
    type: 'Deposit' | 'Borrow';
    asset: string;
    amount: string;
    txHash: string;
};

/**
 * REWARDS
 */
export type IAssetApyProps = {
    apysByToken?: {
        apy: string;
        asset: string;
        symbol: string;
        name: string;
    }[];
    asset: string;
    name: string;
    symbol: string;
    assetType: string;
    description?: string;
    totalApy: string;
};

/**
 * PRICES
 */
export type IAssetPricesProps = {
    oracle: string;
    ethPrice: BigNumber;
    usdPrice: BigNumber;
};

export type IPricesDataProps = {
    prices: Record<IAvailableCoins, IAssetPricesProps> | undefined;
    isLoading: boolean;
    isError: boolean;
};

/**
 * Subgraph
 */
export type IAssetData = {
    underlyingAssetName: string;
};

export type ITrancheCategories = 'VMEX' | 'Standard' | 'External' | 'Unknown';

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
    redeemUnderlyingHistory: IGraphHistoryProps[];
    depositHistory: IGraphHistoryProps[];
};

export type IGraphAssetData = {
    liquidity: BigNumber;
    decimals: string;
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
    isFrozen?: boolean;
};

export type IGraphTrancheAssetProps = IGraphAssetData | Record<string, IGraphAssetData>;

export type IGraphTrancheDataProps = {
    assetsData?: IGraphTrancheAssetProps;
    utilityRate?: string;
    availableLiquidity?: string;
    totalSupplied?: string;
    totalBorrowed?: string;
    totalCollateral?: string;
    assets?: IAvailableCoins[];
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
    avgApy?: number;
    whitelistedUsers?: string[];
    blacklistedUsers?: string[];
    isPaused?: boolean;
    treasury?: string;
    uniqueLenders?: number;
    uniqueBorrowers?: number;
    tvlChart?: ILineChartDataPointProps[];
};

export type IGraphProtocolDataProps =
    | {
          tvl: string;
          reserve: string;
          totalSupplied: string;
          totalBorrowed: string;
          uniqueLenders: number;
          uniqueBorrowers: number;
          markets: number;
          topBorrowedAssets: AssetBalance[];
          topSuppliedAssets: AssetBalance[];
          topTranches: TrancheData[];
      }
    | Record<any, any>;

export type IGraphUserDataProps = {} | Record<any, any>;

export type ISubgraphTrancheData = {
    queryTrancheData: UseQueryResult<IGraphTrancheDataProps, unknown>;
    queryTrancheChart: UseQueryResult<ILineChartDataPointProps[], unknown>;
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

export type ISubgraphAllAssetMappingsData = {
    queryAllAssetMappingsData: UseQueryResult<Map<string, IAssetMappings>, unknown>;
    queryAssetPrices: UseQueryResult<Record<IAvailableCoins, IAssetPricesProps>, unknown>;
    findAssetInMappings: (asset: string) => IAssetMappings | undefined;
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

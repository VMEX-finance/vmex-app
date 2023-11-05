import { BigNumber } from 'ethers';
import { ITrancheCategories } from './subgraph';

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

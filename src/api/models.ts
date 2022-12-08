import { BigNumber } from 'ethers';

export type IMarketsAsset = {
    asset: string;
    tranche: string;
    trancheId: number;
    supplyApy: number | string;
    borrowApy: number | string;
    yourAmount: number | string;
    available: number | string;
    availableNative: number | string;
    supplyTotal: number | string;
    borrowTotal: number | string;
    rating: string;
    strategies: boolean;
    canBeCollateral: boolean;
    canBeBorrowed: boolean;
    currentPrice: BigNumber;
    collateralCap: BigNumber;
    liquidationThreshold: BigNumber;
};

export type ITrancheProps = {
    id: number | string;
    name: string;
    assets: string[];
    aggregateRating: string;
    yourActivity: 'borrowed' | 'supplied' | 'both' | 'none'; // Can also be represented in another way if necessary (i.e. 1 = 'deposited', 2 = 'supplied', etc.)
    tvl: number | string;
    tvlChange?: number;
    supplyTotal: number | string;
    supplyChange?: number;
    borrowTotal: number | string;
    borrowChange?: number;
    longSupply?: number | string;
    longBorrow?: number | string;
    liquidity: number | string;
    poolUtilization: number | string;
    upgradeable: 'Yes' | 'No';
    admin: string;
    platformFee: number | string;
    adminFee: number | string;
    oracle: string;
    whitelist: 'Yes' | 'No';
    ltv: number | string;
    liquidThreshold: number | string;
    liquidPenalty: number | string;
    collateral: 'Yes' | 'No';
    statisticsSupplied: number | string;
    statisticsBorrowed: number | string;
    utilization: number | string;
    reserveFactor: number | string;
    strategy: number | string;
};

export type AvailableAsset = {
    asset: string;
    amount?: number | string;
    amountNative?: number | string;
    apy?: number | string;
    canBeCollat?: boolean;
    liquidity?: number | string;
};
export type ITrancheAssetProps = {
    name: string;
    balance?: number;
    apy?: number;
    collateral?: boolean;
    liquidity?: number;
    ltv?: number;
    liquidThreshold?: number;
    liquidPenalty?: number;
    supplied?: number;
    utilization?: number;
    borrowed?: number;
    fee?: number;
};

export type ITrancheProps = {
    id: number | string;
    name: string;
    assets: string[]; // TODO: change to ITrancheAssetProps
    aggregateRating: string;
    yourActivity: 'borrowed' | 'supplied' | 'both' | 'none'; // Can also be represented in another way if necessary (i.e. 1 = 'deposited', 2 = 'supplied', etc.)
    tvl: number | string;
    supplyTotal: number | string;
    borrowTotal: number | string;
    longSupply: number | string;
    longBorrow: number | string;
    liquidity: number | string;
    poolUtilization: number | string;
    upgradeable: 'Yes' | 'No';
    admin: string;
    platformFee: number | string;
    adminFee: number | string;
    oracle: string;
    whitelist: 'Yes' | 'No';
    ltv: number | string; // TODO: remove after ITrancheAssetProps integrated
    liquidThreshold: number | string; // TODO: remove after ITrancheAssetProps integrated
    liquidPenalty: number | string; // TODO: remove after ITrancheAssetProps integrated
    collateral: 'Yes' | 'No'; // TODO: remove after ITrancheAssetProps integrated
    statisticsSupplied: number | string; // TODO: remove after ITrancheAssetProps integrated
    statisticsBorrowed: number | string; // TODO: remove after ITrancheAssetProps integrated
    utilization: number | string; // TODO: remove after ITrancheAssetProps integrated
    reserveFactor: number | string; // TODO: remove after ITrancheAssetProps integrated
    strategy: number | string;
};

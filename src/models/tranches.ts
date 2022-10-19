export type ITrancheProps = {
    id: number | string;
    name: string;
    assets: string[];
    aggregateRating: string;
    yourActivity: 'deposited' | 'supplied' | 'both' | 'none'; // Can also be represented in another way if necessary (i.e. 1 = 'deposited', 2 = 'supplied', etc.)
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
    ltv: number | string;
    liquidThreshold: number | string;
    liquidPenalty: number | string;
    collateral: 'Yes' | 'No';
    statisticsSupplied: number | string;
    statisticsBorrowed: number | string;
    utilization: number | string;
    reserveFactor: number | string;
};

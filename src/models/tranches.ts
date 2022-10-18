export type Tranche = {
    tranche: string;
    assets: string | undefined; // Should be a list of strings instead
    aggregateRating: string;
    yourActivity: 'deposited' | 'supplied' | 'both' | 'none'; // Can also be represented in another way if necessary (i.e. 1 = 'deposited', 2 = 'supplied', etc.)
    supplyTotal: number | string;
    borrowTotal: number | string;
};

export const _mockAvailableTranche: Tranche = {
    tranche: 'VMEX High Quality',
    assets: 'tokens/token-USDC.svg',
    aggregateRating: 'A+',
    yourActivity: 'none',
    supplyTotal: 22.18,
    borrowTotal: 8.44,
};

export const _mockAvailableTranche2: Tranche = {
    assets: 'tokens/token-WBTC.svg',
    tranche: 'VMEX Mid Quality',
    yourActivity: 'both',
    supplyTotal: 8.73,
    borrowTotal: 4.19,
    aggregateRating: 'C',
};

export const _mockAvailableTranche3: Tranche = {
    assets: 'tokens/token-DAI.svg',
    tranche: 'VMEX Low Quality',
    yourActivity: 'deposited',
    supplyTotal: 17.22,
    borrowTotal: 11.24,
    aggregateRating: 'D',
};

export const _mockTranchesData: Array<Tranche> = [
    _mockAvailableTranche,
    _mockAvailableTranche2,
    _mockAvailableTranche3,
];

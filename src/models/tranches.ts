export type Tranche = {
    tranche: string;
    assets: string | undefined;
    aggregateRating: string;
    yourAmount: number | string;
    supplyTotal: number | string;
    borrowTotal: number | string;
};

export const _mockAvailableTranche: Tranche = {
    tranche: 'VMEX High Quality',
    assets: 'tokens/token-USDC.svg',
    aggregateRating: 'A+',
    yourAmount: 211,
    supplyTotal: 22.18,
    borrowTotal: 8.44,
};

export const _mockAvailableTranche2: Tranche = {
    assets: 'tokens/token-WBTC.svg',
    tranche: 'VMEX Mid Quality',
    yourAmount: 5,
    supplyTotal: 8.73,
    borrowTotal: 4.19,
    aggregateRating: 'C',
};

export const _mockAvailableTranche3: Tranche = {
    assets: 'tokens/token-DAI.svg',
    tranche: 'VMEX Low Quality',
    yourAmount: 67,
    supplyTotal: 17.22,
    borrowTotal: 11.24,
    aggregateRating: 'D',
};

export const _mockTranchesData: Array<Tranche> = [
    _mockAvailableTranche,
    _mockAvailableTranche2,
    _mockAvailableTranche3,
];

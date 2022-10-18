export type MarketsAsset = {
    asset: string;
    logo: string;
    tranche: string;
    trancheId: number;
    supplyApy: number | string;
    borrowApy: number | string;
    yourAmount: number | string;
    available: number | string;
    supplyTotal: number | string;
    borrowTotal: number | string;
    rating: string;
};

export const _mockAvailableAsset: MarketsAsset = {
    asset: 'USDC',
    logo: 'tokens/token-USDC.svg',
    tranche: 'VMEX High Quality',
    trancheId: 1,
    supplyApy: 0.77,
    borrowApy: 2.11,
    yourAmount: 211,
    available: 0,
    supplyTotal: 22.18,
    borrowTotal: 8.44,
    rating: 'A+',
};

export const _mockAvailableAsset2: MarketsAsset = {
    asset: 'WBTC',
    logo: 'tokens/token-WBTC.svg',
    tranche: 'VMEX Mid Quality',
    trancheId: 2,
    supplyApy: 1.21,
    borrowApy: 1.81,
    yourAmount: 5,
    available: 0,
    supplyTotal: 8.73,
    borrowTotal: 4.19,
    rating: 'C',
};

export const _mockAvailableAsset3: MarketsAsset = {
    asset: 'DAI',
    logo: 'tokens/token-DAI.svg',
    tranche: 'VMEX Low Quality',
    trancheId: 3,
    supplyApy: 0.98,
    borrowApy: 2.04,
    yourAmount: 67,
    available: 0,
    supplyTotal: 17.22,
    borrowTotal: 11.24,
    rating: 'D',
};

export const _mockMarketsData: Array<MarketsAsset> = [
    _mockAvailableAsset,
    _mockAvailableAsset2,
    _mockAvailableAsset3,
];

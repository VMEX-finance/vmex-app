import { truncateAddress } from '@utils/helpers';

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
    strategies: boolean;
};

export const _mockAvailableAsset0: MarketsAsset = {
    asset: 'triCrypto2',
    logo: 'tokens/token-CRV.svg',
    tranche: 'VMEX High Quality',
    trancheId: 1,
    supplyApy: 0.87,
    borrowApy: 1.19,
    yourAmount: 0,
    available: 0,
    supplyTotal: 35.18,
    borrowTotal: 30.92,
    rating: 'A+',
    strategies: true,
};

export const _mockAvailableAsset: MarketsAsset = {
    asset: 'USDC',
    logo: 'tokens/token-USDC.svg',
    tranche: 'VMEX High Quality',
    trancheId: 1,
    supplyApy: 0.87,
    borrowApy: 2.19,
    yourAmount: 191,
    available: 0,
    supplyTotal: 25.14,
    borrowTotal: 9.04,
    rating: 'A+',
    strategies: false,
};

export const _mockAvailableAsset2: MarketsAsset = {
    asset: 'WBTC',
    logo: 'tokens/token-WBTC.svg',
    tranche: 'VMEX Mid Quality',
    trancheId: 2,
    supplyApy: 1.07,
    borrowApy: 1.52,
    yourAmount: 6,
    available: 0,
    supplyTotal: 7.38,
    borrowTotal: 5.34,
    rating: 'C+',
    strategies: false,
};

export const _mockAvailableAsset3: MarketsAsset = {
    asset: 'DAI',
    logo: 'tokens/token-DAI.svg',
    tranche: 'VMEX Low Quality',
    trancheId: 3,
    supplyApy: 1.11,
    borrowApy: 2.54,
    yourAmount: 69,
    available: 0,
    supplyTotal: 19.74,
    borrowTotal: 9.14,
    rating: 'D+',
    strategies: false,
};

export const _mockAvailableAsset4: MarketsAsset = {
    asset: 'AAVE',
    logo: 'tokens/token-AAVE.svg',
    tranche: 'VMEX High Quality 2',
    trancheId: 1,
    supplyApy: 0.77,
    borrowApy: 2.11,
    yourAmount: 211,
    available: 0,
    supplyTotal: 22.18,
    borrowTotal: 8.44,
    rating: 'A-',
    strategies: false,
};

export const _mockAvailableAsset5: MarketsAsset = {
    asset: 'ENJ',
    logo: 'tokens/token-ENJ.svg',
    tranche: 'VMEX Mid Quality 2',
    trancheId: 2,
    supplyApy: 1.21,
    borrowApy: 1.81,
    yourAmount: 5,
    available: 0,
    supplyTotal: 8.73,
    borrowTotal: 4.19,
    rating: 'C',
    strategies: false,
};

export const _mockAvailableAsset6: MarketsAsset = {
    asset: 'LINK',
    logo: 'tokens/token-LINK.svg',
    tranche: 'VMEX Low Quality 2',
    trancheId: 3,
    supplyApy: 0.98,
    borrowApy: 2.04,
    yourAmount: 67,
    available: 0,
    supplyTotal: 17.22,
    borrowTotal: 11.24,
    rating: 'D',
    strategies: false,
};

export const _mockAvailableAsset7: MarketsAsset = {
    asset: 'UNI',
    logo: 'tokens/token-UNI.svg',
    tranche: 'VMEX High Quality 3',
    trancheId: 1,
    supplyApy: 1.01,
    borrowApy: 1.55,
    yourAmount: 106,
    available: 0,
    supplyTotal: 29.01,
    borrowTotal: 5.98,
    rating: 'B+',
    strategies: false,
};

export const _mockAvailableAsset8: MarketsAsset = {
    asset: 'MANA',
    logo: 'tokens/token-MANA.svg',
    tranche: 'VMEX Mid Quality 3',
    trancheId: 2,
    supplyApy: 1.21,
    borrowApy: 1.86,
    yourAmount: 4,
    available: 0,
    supplyTotal: 10.73,
    borrowTotal: 6.14,
    rating: 'B-',
    strategies: false,
};

export const _mockAvailableAsset9: MarketsAsset = {
    asset: 'BUSD',
    logo: 'tokens/token-BUSD.svg',
    tranche: 'VMEX Low Quality 3',
    trancheId: 3,
    supplyApy: 0.84,
    borrowApy: 1.54,
    yourAmount: 54,
    available: 0,
    supplyTotal: 14.01,
    borrowTotal: 13.42,
    rating: 'C-',
    strategies: false,
};

export const _mockAvailableAsset10: MarketsAsset = {
    asset: 'TUSD',
    logo: 'tokens/token-TUSD.svg',
    tranche: 'VMEX Low Quality 4',
    trancheId: 3,
    supplyApy: 0.93,
    borrowApy: 1.99,
    yourAmount: 96,
    available: 0,
    supplyTotal: 21.43,
    borrowTotal: 8.66,
    rating: 'D-',
    strategies: false,
};

export const _mockMarketsData: Array<MarketsAsset> = [
    _mockAvailableAsset0,
    _mockAvailableAsset,
    _mockAvailableAsset2,
    _mockAvailableAsset3,
    _mockAvailableAsset4,
    _mockAvailableAsset5,
    _mockAvailableAsset6,
    _mockAvailableAsset7,
    _mockAvailableAsset8,
    _mockAvailableAsset9,
    _mockAvailableAsset10,
];

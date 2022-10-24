export type TrancheSupply = {
    asset: string;
    logo: string;
    balance: string | number;
    apy: string | number;
    collateral: boolean;
    liquidity?: any;
    tranche: string;
    trancheId: number | string;
    strategies: boolean;
};

export const _mockAvailableAsset: TrancheSupply = {
    asset: 'USDC',
    logo: 'tokens/token-USDC.svg',
    balance: 123.13,
    apy: 2.32,
    collateral: true,
    tranche: 'VMEX Mid Quality',
    trancheId: 2,
    strategies: true,
};

export const _mockAvailableAsset2: TrancheSupply = {
    asset: 'WBTC',
    logo: 'tokens/token-WBTC.svg',
    balance: 123.13,
    apy: 2.32,
    collateral: false,
    tranche: 'VMEX Mid Quality',
    trancheId: 2,
    strategies: true,
};

export const _mockAvailableAsset3: TrancheSupply = {
    asset: 'DAI',
    logo: 'tokens/token-DAI.svg',
    balance: 123.13,
    apy: 2.32,
    collateral: false,
    tranche: 'VMEX Mid Quality',
    trancheId: 2,
    strategies: true,
};

export const _mockMarketsData: Array<TrancheSupply> = [
    _mockAvailableAsset,
    _mockAvailableAsset2,
    _mockAvailableAsset3,
];

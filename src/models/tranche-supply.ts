export type TrancheSupply = {
    asset: string;
    logo: string;
    balance: string | number;
    apy: string | number;
    collateral: boolean;
    liquidity?: any;
};

export const _mockAvailableAsset: TrancheSupply = {
    asset: 'USDC',
    logo: 'tokens/token-USDC.svg',
    balance: 123.13,
    apy: 2.32,
    collateral: true,
};

export const _mockAvailableAsset2: TrancheSupply = {
    asset: 'WBTC',
    logo: 'tokens/token-WBTC.svg',
    balance: 123.13,
    apy: 2.32,
    collateral: true,
};

export const _mockAvailableAsset3: TrancheSupply = {
    asset: 'DAI',
    logo: 'tokens/token-DAI.svg',
    balance: 123.13,
    apy: 2.32,
    collateral: true,
};

export const _mockMarketsData: Array<TrancheSupply> = [
    _mockAvailableAsset,
    _mockAvailableAsset2,
    _mockAvailableAsset3,
];

export type TrancheBorrow = {
    asset: string;
    logo: string;
    balance: string | number;
    apy: string | number;
    liquidity: string | number;
    collateral?: any;
};

export const _mockAvailableAsset: TrancheBorrow = {
    asset: 'USDC',
    logo: 'tokens/token-USDC.svg',
    balance: 123.13,
    apy: 2.32,
    liquidity: 1.94,
};

export const _mockAvailableAsset2: TrancheBorrow = {
    asset: 'WBTC',
    logo: 'tokens/token-WBTC.svg',
    balance: 123.13,
    apy: 2.32,
    liquidity: 1.87,
};

export const _mockAvailableAsset3: TrancheBorrow = {
    asset: 'DAI',
    logo: 'tokens/token-DAI.svg',
    balance: 123.13,
    apy: 2.32,
    liquidity: 1.95,
};

export const _mockBorrowData: Array<TrancheBorrow> = [
    _mockAvailableAsset,
    _mockAvailableAsset2,
    _mockAvailableAsset3,
];

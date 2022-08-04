export type AvailableAsset = {
    asset: string;
    logo: string;
    unit: string;
    amount: number;
    apy_perc: number;
    canBeCollat: boolean;
}

export const _mockAvailableAsset: AvailableAsset = {
    asset: "USDC",
    logo: "tokens/token-USDC.svg",
    unit: "USDC",
    amount: 2394,
    apy_perc: .0053,
    canBeCollat: true
}
export const _mockAvailableAsset2: AvailableAsset = {
    asset: "XRP",
    logo: "tokens/token-XRP.svg",
    unit: "XRP",
    amount: 2394,
    apy_perc: .0053,
    canBeCollat: false
}
export const _mockAvailableAsset3: AvailableAsset = {
    asset: "BTC",
    logo: "tokens/token-BTC.svg",
    unit: "BTC",
    amount: 2394,
    apy_perc: .0053,
    canBeCollat: true
}

export const _mockAssetData: any = {
    data: [_mockAvailableAsset, _mockAvailableAsset2, _mockAvailableAsset3]
}

export {}
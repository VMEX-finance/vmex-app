export type AssetExposureType = {
    asset: string;
    unit: string;
    logo: string;
    amount: number | string;
    collateral_perc: number;
    apy_perc: number;
    insurance_perc: number;
    tranche_id: number;
}

export interface ITrancheBasedAssetExposure {
    tranche_id: number;
    assets: AssetExposureType[];
}

export const _mockAsset: AssetExposureType = {
    asset: "USDC",
    unit: "USDC",
    logo: "tokens/token-USDC.svg",
    amount: "23.423",
    collateral_perc: .054,
    apy_perc: .012,
    insurance_perc: 0.043,
    tranche_id: 0
}
export const _mockAsset2: AssetExposureType = {
    asset: "DAI",
    unit: "DAI",
    logo: "tokens/token-DAI.svg",
    amount: "23.423",
    collateral_perc: .054,
    apy_perc: .012,
    insurance_perc: 0.043,
    tranche_id: 0
}
export const _mockAsset3: AssetExposureType = {
    asset: "WBTC",
    unit: "WBTC",
    logo: "tokens/token-WBTC.svg",
    amount: "23.423",
    collateral_perc: .054,
    apy_perc: .012,
    insurance_perc: 0.043,
    tranche_id: 0
}

export const _mockTrancheAssetExposure: ITrancheBasedAssetExposure = {
    tranche_id: 0,
    assets: [_mockAsset]
}
export const _mockTrancheAssetExposure2: ITrancheBasedAssetExposure = {
    tranche_id: 0,
    assets: [_mockAsset2]
}
export const _mockTrancheAssetExposure3: ITrancheBasedAssetExposure = {
    tranche_id: 0,
    assets: [_mockAsset3]
}
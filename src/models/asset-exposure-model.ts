export type AssetExposureType = {
    asset: string;
    unit: string;
    logo: string;
    amount: number | string;
    collateral_perc: number;
    apy_perc: number;
    insurance_perc: number;
    tranche_id: number;
};

export interface ITrancheBasedAssetExposure {
    tranche_id: number;
    assets: AssetExposureType[];
}

export type IAssetApyProps = {
    apysByToken?: {
        apy: string;
        asset: string;
        symbol: string;
        name: string;
    }[];
    asset: string;
    name: string;
    symbol: string;
    assetType: string;
    description?: string;
    totalApy: string;
};

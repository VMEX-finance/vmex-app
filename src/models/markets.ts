export type IMarketsAsset = {
    asset: string;
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

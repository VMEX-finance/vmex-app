import { BigNumber } from 'ethers';

export type IMarketsAsset = {
    asset: string;
    tranche: string;
    trancheId: number;
    supplyApy: number | string;
    borrowApy: number | string;
    yourAmount: number | string;
    available: number | string;
    availableNative: number | string;
    supplyTotal: number | string;
    borrowTotal: number | string;
    rating: string;
    strategies: boolean;
    canBeCollateral: boolean;
    canBeBorrowed: boolean;
    currentPrice: BigNumber;
    collateralCap: BigNumber;
    liquidationThreshold: BigNumber;
};

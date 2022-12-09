import { useQuery } from '@tanstack/react-query';
import { IMarketsDataProps } from './types';
import { getAllMarketsData, getAllTrancheData, MarketData } from '@vmex/sdk';
import {
    bigNumberToNative,
    bigNumberToUSD,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    rayToPercent,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { IMarketsAsset } from '../models';
import { BigNumber } from 'ethers';

export async function getAllMarkets(): Promise<IMarketsAsset[]> {
    const allMarketsData: MarketData[] = await getAllMarketsData(SDK_PARAMS);
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    const allTrancheData = await getAllTrancheData(SDK_PARAMS);
    const findAssetInTranche = (searchAsset: string, trancheId: number): string => {
        let trancheName = 'N/A';
        allTrancheData.map((tranche: any) => {
            if (tranche.id.toNumber() === trancheId) {
                tranche.assets.map((asset: any) => {
                    if (searchAsset === asset) {
                        trancheName = tranche.name;
                    }
                });
            }
        });
        return trancheName;
    };

    return allMarketsData.map((marketData: MarketData) => {
        const asset = reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset;

        return {
            asset,
            tranche: findAssetInTranche(marketData.asset.toString(), marketData.tranche.toNumber()),
            trancheId: marketData.tranche.toNumber(),
            supplyApy: rayToPercent(marketData.supplyApy),
            borrowApy: rayToPercent(marketData.borrowApy),
            yourAmount: 0,
            available: bigNumberToUSD(marketData.totalReserves, 18),
            availableNative: BigNumber.from('0'), //not used
            supplyTotal: bigNumberToUSD(marketData.totalSupplied, 18),
            borrowTotal: bigNumberToUSD(marketData.totalBorrowed, 18),
            rating: '-',
            strategies: marketData.strategyAddress != '0x0000000000000000000000000000000000000000',
            canBeCollateral: marketData.canBeCollateral,
            canBeBorrowed: marketData.canBeBorrowed,
            currentPrice: marketData.currentPriceETH,
            collateralCap: marketData.collateralCap,
            liquidationThreshold: marketData.liquidationThreshold,
        };
    });
}

export function useMarketsData(): IMarketsDataProps {
    const queryAllMarkets = useQuery({
        queryKey: ['all-markets'],
        queryFn: getAllMarkets,
        refetchOnMount: true,
    });

    return {
        queryAllMarkets,
    };
}

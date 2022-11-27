import { IMarketsAsset } from '@models/markets';
import { useQuery } from '@tanstack/react-query';
import { MOCK_MARKETS_DATA } from '../../utils/mock-data';
import { IMarketsDataProps } from './types';
import { getAllMarketsData, MarketData } from '@vmex/sdk';
import {
    bigNumberToUSD,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    rayToPercent,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';

export async function getAllMarkets(): Promise<IMarketsAsset[]> {
    const allMarketsData: MarketData[] = await getAllMarketsData(SDK_PARAMS);
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    return allMarketsData.map((marketData: MarketData) => {
        return {
            asset: reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset,
            tranche: marketData.tranche.toString(),
            trancheId: marketData.tranche.toNumber(),
            supplyApy: rayToPercent(marketData.supplyApy),
            borrowApy: rayToPercent(marketData.borrowApy),
            yourAmount: 0,
            available: bigNumberToUSD(marketData.totalReserves, 18),
            supplyTotal: bigNumberToUSD(marketData.totalSupplied, 18),
            borrowTotal: bigNumberToUSD(marketData.totalBorrowed, 18),
            rating: '-',
            strategies: marketData.strategyAddress != '0x0000000000000000000000000000000000000000',
            canBeCollateral: marketData.canBeCollateral,
            canBeBorrowed: marketData.canBeBorrowed,
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

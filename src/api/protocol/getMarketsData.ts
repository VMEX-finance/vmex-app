import { IMarketsAsset } from '@models/markets';
import { useQuery } from '@tanstack/react-query';
import { MOCK_MARKETS_DATA } from '../../utils/mock-data';
import { IMarketsDataProps } from './types';
import { getAllMarketsData, MarketData } from '@vmex/sdk';
import { flipAndLowerCase, MAINNET_ASSET_MAPPINGS, SDK_PARAMS } from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';

export async function getAllMarkets(): Promise<IMarketsAsset[]> {
    const allMarketsData = await getAllMarketsData(SDK_PARAMS);
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    return allMarketsData.map((marketData: MarketData) => {
        return {
            asset: reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset,
            tranche: marketData.tranche.toString(),
            trancheId: marketData.tranche.toNumber(),
            supplyApy: 0,
            borrowApy: 0,
            yourAmount: 0,
            available: marketData.totalSupplied.sub(marketData.totalBorrowed).toString(),
            supplyTotal: marketData.totalSupplied.toString(),
            borrowTotal: marketData.totalBorrowed.toString(),
            rating: '-',
            strategies: marketData.strategyAddress != '0x0000000000000000000000000000000000000000',
        };
    });
}

export function useMarketsData(): IMarketsDataProps {
    const queryAllMarkets = useQuery({
        queryKey: ['all-tranches'],
        queryFn: getAllMarkets,
    });

    return {
        queryAllMarkets,
    };
}

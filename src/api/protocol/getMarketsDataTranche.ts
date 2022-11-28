import { IMarketsAsset } from '@models/markets';
import { useQuery } from '@tanstack/react-query';
import { MOCK_MARKETS_DATA } from '../../utils/mock-data';
import { ITrancheMarketsDataProps } from './types';
import { getTrancheMarketsData, MarketData, getAllMarketsData } from '@vmex/sdk';
import {
    bigNumberToUSD,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';

export async function getTrancheMarkets(trancheId: number): Promise<IMarketsAsset[]> {
    const allMarketsData: MarketData[] = await getTrancheMarketsData({
        tranche: trancheId,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
    });
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    return allMarketsData.map((marketData: MarketData) => {
        return {
            asset: reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset,
            tranche: marketData.tranche.toString(),
            trancheId: marketData.tranche.toNumber(),
            supplyApy:
                marketData.supplyApy
                    .div(
                        BigNumber.from('10000000000000000000000'), // div by 10^22
                    )
                    .toNumber() / 1000, // div by 10^3 to get percent
            borrowApy:
                marketData.borrowApy
                    .div(
                        BigNumber.from('10000000000000000000000'), // div by 10^22
                    )
                    .toNumber() / 1000,
            yourAmount: 0, //TODO:
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

export function useTrancheMarketsData(trancheId: number): ITrancheMarketsDataProps {
    const queryTrancheMarkets = useQuery({
        queryKey: ['tranche-markets', trancheId],
        queryFn: () => getTrancheMarkets(trancheId),
        refetchOnMount: true,
    });

    return {
        queryTrancheMarkets,
    };
}

import { useQuery } from '@tanstack/react-query';
import { ITrancheMarketsDataProps } from './types';
import { getTrancheMarketsData, MarketData, getAllMarketsData } from '@vmex/sdk';
import {
    bigNumberToUSD,
    bigNumberToNative,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    SDK_PARAMS,
    DECIMALS,
} from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';
import { AVAILABLE_ASSETS } from '../../utils/constants';
import { IMarketsAsset } from '../models';

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
            availableNative: bigNumberToNative(
                marketData.totalReservesNative,
                DECIMALS.get(
                    reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset,
                ) || 18,
            ),
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

export function useTrancheMarketsData(trancheId: number): ITrancheMarketsDataProps {
    const queryTrancheMarkets = useQuery({
        queryKey: ['tranche-markets', trancheId],
        queryFn: () => getTrancheMarkets(trancheId),
        refetchOnMount: true,
    });

    const getTrancheMarket = (asset: string) => {
        if (!AVAILABLE_ASSETS.includes(asset) || !queryTrancheMarkets.data) {
            console.log(`Tranche market for ${asset} not found`);
            return {
                asset: '',
                tranche: '',
                trancheId: 0,
                supplyApy: 0,
                borrowApy: 0,
                yourAmount: 0, //TODO:
                available: '$0',
                availableNative: '0',
                supplyTotal: '$0',
                borrowTotal: '$0',
                rating: '-',
                strategies: false,
                canBeCollateral: false,
                canBeBorrowed: false,
                currentPrice: BigNumber.from('0'),
                collateralCap: BigNumber.from('0'),
                liquidationThreshold: BigNumber.from('0'),
            };
        } else {
            const found = queryTrancheMarkets.data.find((el) => el.asset === asset);
            if (found) return found;
            else {
                return {
                    asset: '',
                    tranche: '',
                    trancheId: 0,
                    supplyApy: 0,
                    borrowApy: 0,
                    yourAmount: 0, //TODO:
                    available: '$0',
                    availableNative: '0',
                    supplyTotal: '$0',
                    borrowTotal: '$0',
                    rating: '-',
                    strategies: false,
                    canBeCollateral: false,
                    canBeBorrowed: false,
                    currentPrice: BigNumber.from('0'),
                    collateralCap: BigNumber.from('0'),
                    liquidationThreshold: BigNumber.from('0'),
                };
            }
        }
    };

    return {
        queryTrancheMarkets,
        getTrancheMarket,
    };
}

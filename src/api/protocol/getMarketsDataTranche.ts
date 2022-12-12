import { useQuery } from '@tanstack/react-query';
import { ITrancheMarketsDataProps } from './types';
import { getTrancheMarketsData, MarketData } from '@vmex/sdk';
import {
    bigNumberToUSD,
    SDK_PARAMS,
    REVERSE_MAINNET_ASSET_MAPPINGS,
} from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';
import { AVAILABLE_ASSETS } from '../../utils/constants';
import { IMarketsAsset } from '../types';

export async function getTrancheMarkets(trancheId: number): Promise<IMarketsAsset[]> {
    const allMarketsData: MarketData[] = await getTrancheMarketsData({
        tranche: trancheId,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
    });

    return allMarketsData.map((marketData: MarketData) => {
        let asset =
            REVERSE_MAINNET_ASSET_MAPPINGS.get(marketData.asset.toLowerCase()) || marketData.asset;
        return {
            asset: asset,
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
            available: bigNumberToUSD(marketData.totalReserves, 18),
            availableNative: marketData.totalReservesNative,
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
                available: '$0',
                availableNative: BigNumber.from('0'),
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
                    available: '$0',
                    availableNative: BigNumber.from('0'),
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

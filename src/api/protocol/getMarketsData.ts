import { useQuery } from '@tanstack/react-query';
import { IMarketsDataProps } from './types';
import { getAllMarketsData, getAllTrancheData, MarketData } from '@vmexfinance/sdk';
import {
    bigNumberToUSD,
    DECIMALS,
    rayToPercent,
    REVERSE_MAINNET_ASSET_MAPPINGS,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { IMarketsAsset } from '../types';
import { BigNumber, utils } from 'ethers';

export async function getAllMarkets(): Promise<IMarketsAsset[]> {
    const allMarketsData: MarketData[] = await getAllMarketsData(SDK_PARAMS);

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
        const asset =
            REVERSE_MAINNET_ASSET_MAPPINGS.get(marketData.asset.toLowerCase()) || marketData.asset;

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
            collateralCap: BigNumber.from('0'), //marketData.collateralCap,
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

    const getAssetsPrices = (_asset?: string) => {
        if (!queryAllMarkets.data) return {};
        else {
            const assets: any[] = [];
            queryAllMarkets.data.map((el: any) => {
                if (assets.includes(el.asset) === false) assets.push(el);
            });
            // Not sure why USDC, WBTC, and USDT bigNumbers are off, but DAI is fine
            const dai = assets.find((el) => el.asset === 'DAI');
            const finalObj = assets.reduce(
                (obj: any, item: any) =>
                    Object.assign(obj, {
                        [item.asset]: {
                            ethPrice:
                                item.asset === 'USDC' || item.asset === 'USDT'
                                    ? parseFloat(
                                          utils.formatUnits(
                                              dai.currentPrice,
                                              DECIMALS.get(dai.asset),
                                          ),
                                      )
                                    : parseFloat(
                                          utils.formatUnits(
                                              item.currentPrice,
                                              DECIMALS.get(item.asset),
                                          ),
                                      ),
                            usdPrice: '$0',
                        },
                    }),
                {},
            );
            if (_asset) {
                const asset = finalObj[_asset];
                if (asset) {
                    return finalObj[_asset];
                } else {
                    return { ethPrice: '0', usdPrice: '$0' };
                }
            } else {
                return finalObj;
            }
        }
    };

    return {
        queryAllMarkets,
        getAssetsPrices,
    };
}

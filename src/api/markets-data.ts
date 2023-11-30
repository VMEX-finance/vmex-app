import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ISubgraphAllMarketsData, ISubgraphMarketsChart } from './types';
import { ILineChartDataPointProps } from '@/ui/components';
import { utils } from 'ethers';
import { IMarketsAsset } from './types';
import { getAllAssetPrices } from './asset-prices';
import { nativeAmountToUSD, PRICING_DECIMALS, getNetworkName } from '@/utils';
import { getApolloClient } from '@/config';
import { convertSymbolToAddress } from '@vmexfinance/sdk';
import { getReserveId } from './id-generation';
import { getAllAssetApys } from '.';

export const getSubgraphMarketsChart = async (
    _trancheId: string | number,
    _underlyingAsset: string | undefined,
): Promise<ILineChartDataPointProps[][] | any> => {
    if (!_trancheId || !_underlyingAsset) {
        return [];
    }

    const trancheId = _trancheId.toString();
    const reserveId = getReserveId(_underlyingAsset, trancheId);
    const { data, error } = await getApolloClient().query({
        query: gql`
            query QueryMarket($reserveId: String!) {
                reserve(id: $reserveId) {
                    paramsHistory(orderBy: timestamp, orderDirection: desc) {
                        variableBorrowRate
                        liquidityRate
                        utilizationRate
                        timestamp
                    }
                }
            }
        `,
        variables: { reserveId },
    });

    if (error) return [];
    else {
        let supplyBorrowRateChart: ILineChartDataPointProps[] = [];
        let utilizationChart: ILineChartDataPointProps[] = [];

        data.reserve?.paramsHistory &&
            data.reserve.paramsHistory.map((histItem: any) => {
                const date = new Date(histItem.timestamp * 1000).toLocaleDateString();

                supplyBorrowRateChart.push({
                    xaxis: date,
                    value: parseFloat(utils.formatUnits(histItem.liquidityRate, 27)) * 100,
                    value2: parseFloat(utils.formatUnits(histItem.variableBorrowRate, 27)) * 100,
                });

                utilizationChart.push({
                    xaxis: date,
                    value: histItem.utilizationRate * 100,
                });
            });
        supplyBorrowRateChart.reverse();
        utilizationChart.reverse();

        return {
            supplyBorrowRateChart,
            utilizationChart,
            yieldStrategy: false, //hardcoded since we don't have strategies
        };
    }
};

export const getSubgraphAllMarketsData = async (): Promise<IMarketsAsset[]> => {
    // TODO: Scale this in case # markets > 1000
    const { data, error } = await getApolloClient().query({
        query: gql`
            query QueryAllMarkets {
                reserves(
                    orderBy: availableLiquidity
                    orderDirection: desc
                    where: { symbol_not: "" }
                ) {
                    decimals
                    tranche {
                        id
                        name
                    }
                    liquidityRate
                    variableBorrowRate
                    availableLiquidity
                    totalDeposits
                    totalCurrentVariableDebt
                    usageAsCollateralEnabled
                    borrowingEnabled
                    # reserveLiquidationThreshold
                    assetData {
                        id
                        underlyingAssetName
                        liquidationThreshold
                        id
                    }
                    aToken {
                        externalReward {
                            isActive
                        }
                    }
                }
            }
        `,
    });

    if (error) return [];
    else {
        const network = getNetworkName();
        const prices = await getAllAssetPrices();
        const apyRes = await getAllAssetApys();

        const replaceSubgraphApy = (reserve: any) => {
            const found = apyRes.find(
                (el) => el.asset?.toLowerCase() === reserve.assetData.id?.toLowerCase(),
            );
            if (found) {
                return (Number(found.totalApy) / 100).toString();
            }
            return utils.formatUnits(reserve.liquidityRate, 27);
        };

        const returnObj: IMarketsAsset[] = [];
        data.reserves.map((reserve: any) => {
            const asset = reserve.assetData.underlyingAssetName.toUpperCase();
            if (!(prices as any)[asset]) {
                return;
            }
            const assetUSDPrice = (prices as any)[asset].usdPrice;

            returnObj.push({
                assetAddress: reserve.assetData.id,
                asset: reserve.assetData.underlyingAssetName,
                tranche: reserve.tranche.name,
                trancheId:
                    reserve.tranche.id && reserve.tranche.id.includes(':')
                        ? reserve.tranche.id.split(':')[1]
                        : reserve.tranche.id,
                borrowApy: utils.formatUnits(reserve.variableBorrowRate, 27),
                supplyApy: replaceSubgraphApy(reserve),
                available: nativeAmountToUSD(
                    reserve.availableLiquidity,
                    PRICING_DECIMALS[network],
                    reserve.decimals,
                    assetUSDPrice,
                ),

                availableNative: reserve.availableLiquidity,
                supplyTotal: nativeAmountToUSD(
                    reserve.totalDeposits,
                    PRICING_DECIMALS[network],
                    reserve.decimals,
                    assetUSDPrice,
                ),

                borrowTotal: nativeAmountToUSD(
                    reserve.totalCurrentVariableDebt,
                    PRICING_DECIMALS[network],
                    reserve.decimals,
                    assetUSDPrice,
                ),

                rating: '-',
                canBeCollateral: reserve.usageAsCollateralEnabled,
                canBeBorrowed: reserve.borrowingEnabled,
                liquidationThreshold: reserve.assetData.liquidationThreshold,
                strategies: reserve.aToken?.externalReward?.isActive || false,
            });
        });
        return returnObj;
    }
};

export function useSubgraphMarketsData(
    _trancheId: string | number,
    _underlyingAsset: string | undefined,
): ISubgraphMarketsChart {
    const network = getNetworkName();
    let underlyingAsset: string = '';
    if (_underlyingAsset) {
        underlyingAsset = convertSymbolToAddress(_underlyingAsset || '', network)?.toLowerCase();
    }
    const queryMarketsChart = useQuery({
        queryKey: [`markets-chart`, Number(_trancheId), _underlyingAsset, network],
        queryFn: () => getSubgraphMarketsChart(_trancheId, underlyingAsset),
    });

    return {
        queryMarketsChart,
    };
}

export function useSubgraphAllMarketsData(): ISubgraphAllMarketsData {
    const network = getNetworkName();

    const queryAllMarketsData = useQuery({
        queryKey: [`markets-data`, network],
        queryFn: () => getSubgraphAllMarketsData(),
    });

    return {
        queryAllMarketsData,
    };
}

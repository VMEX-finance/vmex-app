import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { ISubgraphAllMarketsData, ISubgraphMarketsChart } from './types';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { BigNumber, utils } from 'ethers';
import { MAINNET_ASSET_MAPPINGS, nativeAmountToUSD } from '../../utils/sdk-helpers';
import { IMarketsAsset } from '../types';
import { getAllAssetPrices } from '../prices';
import { usdFormatter } from '../../utils/helpers';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

function getReserveId(underlyingAsset: string, poolId: string, trancheId: string): string {
    return `${underlyingAsset}${poolId}${trancheId}`;
}

export const getSubgraphMarketsChart = async (
    _trancheId: string | number,
    _underlyingAsset: string | undefined,
): Promise<ILineChartDataPointProps[][] | any> => {
    if (!_trancheId || !_underlyingAsset) {
        return [];
    }

    const trancheId = _trancheId.toString();
    const poolId = '0xd6c850aebfdc46d7f4c207e445cc0d6b0919bdbe'; // TODO: address of LendingPoolConfigurator
    const reserveId = getReserveId(_underlyingAsset, poolId, trancheId);
    const { data, error } = await client.query({
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

        const { paramsHistory } = data.reserve;

        paramsHistory.map((histItem: any) => {
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
        };
    }
};

export const getSubgraphAllMarketsData = async (): Promise<IMarketsAsset[]> => {
    // TODO: Scale this in case # markets > 1000
    const { data, error } = await client.query({
        query: gql`
            query QueryAllMarkets {
                reserves(orderBy: availableLiquidity, orderDirection: desc) {
                    assetData {
                        underlyingAssetName
                    }
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
                        underlyingAssetName
                        liquidationThreshold
                    }
                }
            }
        `,
    });

    if (error) return [];
    else {
        const prices = await getAllAssetPrices();

        const returnObj: IMarketsAsset[] = [];
        data.reserves.map((reserve: any) => {
            const asset = reserve.assetData.underlyingAssetName;
            const assetUSDPrice = (prices as any)[asset].usdPrice;

            returnObj.push({
                asset: asset,
                tranche: reserve.tranche.name,
                trancheId: reserve.tranche.id,
                borrowApy: utils.formatUnits(reserve.variableBorrowRate, 27),
                supplyApy: utils.formatUnits(reserve.liquidityRate, 27),
                available: usdFormatter().format(
                    nativeAmountToUSD(reserve.availableLiquidity, reserve.decimals, assetUSDPrice),
                ),
                availableNative: reserve.availableLiquidity,
                supplyTotal: usdFormatter().format(
                    nativeAmountToUSD(reserve.totalDeposits, reserve.decimals, assetUSDPrice),
                ),
                borrowTotal: usdFormatter().format(
                    nativeAmountToUSD(
                        reserve.totalCurrentVariableDebt,
                        reserve.decimals,
                        assetUSDPrice,
                    ),
                ),
                rating: '-',
                strategies: false, //TODO
                canBeCollateral: reserve.usageAsCollateralEnabled,
                canBeBorrowed: reserve.borrowingEnabled,
                currentPrice: BigNumber.from('0'), // TODO
                collateralCap: BigNumber.from('0'), // TODO
                liquidationThreshold: reserve.assetData.liquidationThreshold,
            });
        });

        return returnObj;
    }
};

export function useSubgraphMarketsData(
    _trancheId: string | number,
    _underlyingAsset: string | undefined,
): ISubgraphMarketsChart {
    const underlyingAsset = MAINNET_ASSET_MAPPINGS.get(_underlyingAsset || '')?.toLowerCase();
    const queryMarketsChart = useQuery({
        queryKey: [`subgraph-markets-chart-${_trancheId}-${underlyingAsset}`], // TODO: fix this to make the id and asset filters instead of a part of the key
        queryFn: () => getSubgraphMarketsChart(_trancheId, underlyingAsset),
    });

    return {
        queryMarketsChart,
    };
}

export function useSubgraphAllMarketsData(): ISubgraphAllMarketsData {
    const queryAllMarketsData = useQuery({
        queryKey: [`subgraph-all-markets-data`],
        queryFn: () => getSubgraphAllMarketsData(),
    });

    return {
        queryAllMarketsData,
    };
}

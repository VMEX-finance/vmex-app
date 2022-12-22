import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { IGraphTrancheAssetProps, ISubgraphAllMarketsData, ISubgraphMarketsChart } from './types';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { BigNumber, utils } from 'ethers';
import { MAINNET_ASSET_MAPPINGS } from '../../utils/sdk-helpers';
import { MOCK_MULTI_LINE_DATA } from '../../utils/mock-data';
import { IMarketsAsset } from '../types';

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

    console.log('original tranche id is', _trancheId);
    const trancheId = _trancheId.toString();
    console.log('tranche id is', trancheId);
    const poolId = '0xd6c850aebfdc46d7f4c207e445cc0d6b0919bdbe'; // TODO: address of LendingPoolConfigurator
    const reserveId = getReserveId(_underlyingAsset, poolId, trancheId);

    console.log('reserve id is', reserveId);
    const { data, error } = await client.query({
        query: gql`
            query QueryTranche($reserveId: String!) {
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
                    symbol
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
                    reserveLiquidationThreshold
                }
            }
        `,
    });

    if (error) return [];
    else {
        const returnObj: IMarketsAsset[] = [];
        data.reserves.map((reserve: any) => {
            returnObj.push({
                asset: reserve.symbol.slice(0, -1),
                tranche: reserve.tranche.name,
                trancheId: reserve.tranche.id,
                borrowApy: utils.formatUnits(reserve.variableBorrowRate, 27),
                supplyApy: utils.formatUnits(reserve.liquidityRate, 27),
                available: utils.formatUnits(reserve.availableLiquidity, reserve.decimals),
                availableNative: reserve.availableLiquidity,
                supplyTotal: utils.formatUnits(reserve.totalDeposits, reserve.decimals),
                borrowTotal: utils.formatUnits(reserve.totalCurrentVariableDebt, reserve.decimals),
                rating: '-',
                strategies: false, //TODO
                canBeCollateral: reserve.usageAsCollateralEnabled,
                canBeBorrowed: reserve.borrowingEnabled,
                currentPrice: BigNumber.from('0'), // TODO
                collateralCap: BigNumber.from('0'), // TODO
                liquidationThreshold: reserve.reserveLiquidationThreshold,
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
        queryKey: [`subgraph-markets-chart-${_trancheId}-${underlyingAsset}`],
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

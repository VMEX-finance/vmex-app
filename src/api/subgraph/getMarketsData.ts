import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { ISubgraphMarketsData } from './types';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { utils } from 'ethers';
import { MAINNET_ASSET_MAPPINGS } from '../../utils/sdk-helpers';
import { MOCK_MULTI_LINE_DATA } from '../../utils/mock-data';

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

export function useSubgraphMarketsData(
    _trancheId: string | number,
    _underlyingAsset: string | undefined,
): ISubgraphMarketsData {
    const underlyingAsset = MAINNET_ASSET_MAPPINGS.get(_underlyingAsset || '')?.toLowerCase();
    const queryMarketsChart = useQuery({
        queryKey: [`subgraph-markets-chart-${_trancheId}-${underlyingAsset}`],
        queryFn: () => getSubgraphMarketsChart(_trancheId, underlyingAsset),
    });

    return {
        queryMarketsChart,
    };
}

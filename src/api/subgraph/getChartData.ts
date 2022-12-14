import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { bigNumberToUSD, DECIMALS } from '../../utils/sdk-helpers';
import { IGraphTrancheProps } from './types';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

export const getTVLChartData = async () => {
    const { data, error } = await client.query({
        query: gql`
            query MyQuery {
                tranches {
                    id
                    borrowHistory {
                        timestamp
                        amount
                        reserve {
                            symbol
                        }
                    }
                    depositHistory {
                        timestamp
                        amount
                        reserve {
                            symbol
                        }
                    }
                }
            }
        `,
    });
    if (error) return [];
    else {
        let graphData: ILineChartDataPointProps[] = [];
        data.tranches.map((tranche: IGraphTrancheProps) => {
            tranche.depositHistory.map((el) => {
                const asset = el.reserve.symbol.slice(0, -1);
                // TODO: fix to be in terms of USD, not native amounts (use oracles)
                const usdAmount = parseFloat(
                    bigNumberToUSD(el.amount, DECIMALS.get(asset) || 18, false),
                );
                const date = new Date(el.timestamp * 1000).toLocaleDateString();

                if (graphData.length === 0) graphData.push({ value: usdAmount, xaxis: date });
                else {
                    graphData.map((plot) => {
                        if (plot.xaxis === date) {
                            plot.value = plot.value + usdAmount;
                        } else {
                            graphData.push({ value: usdAmount, xaxis: date });
                        }
                    });
                }
            });

            tranche.borrowHistory.map((el) => {
                const asset = el.reserve.symbol.slice(0, -1);
                // TODO: fix to be in terms of USD, not native amounts (use oracles)
                const usdAmount = parseFloat(
                    bigNumberToUSD(el.amount, DECIMALS.get(asset) || 18, false),
                );
                const date = new Date(el.timestamp * 1000).toLocaleDateString();

                graphData.map((plot) => {
                    if (plot.xaxis === date) {
                        plot.value = plot.value - usdAmount;
                    } else {
                        graphData.push({ value: -usdAmount, xaxis: date });
                    }
                });
            });
        });

        // Loop through and add previous day TVL to current day TVL
        graphData.forEach(function (plot, index) {
            if (index > 0) {
                plot.value = plot.value + graphData[index - 1].value;
            }
        });
        return graphData;
    }
};

export const getTrancheChartData = async (trancheId?: string | number) => {
    if (!trancheId) return [];
    const { data, error } = await client.query({
        query: gql`
            query QueryTranche {
                tranche(id: trancheId) {
                    id
                }
            }
        `,
    });

    console.log('getTrancheChartData:', data);
};

export function useSubgraphChartData(trancheId?: string | number) {
    const queryTVLChartData = useQuery({
        queryKey: ['subgraph-charts-tvl'],
        queryFn: () => getTVLChartData(),
        refetchInterval: 1 * 60 * 1000, // Refetch every minute
    });

    const queryTrancheChartData = useQuery({
        queryKey: ['subgraph-charts-asset'],
        queryFn: () => getTrancheChartData(trancheId),
        refetchInterval: 1 * 60 * 1000, // Refetch every minute
    });

    return {
        queryTVLChartData,
        queryTrancheChartData,
    };
}

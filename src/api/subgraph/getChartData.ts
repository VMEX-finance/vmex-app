import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';

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
                    }
                    depositHistory {
                        timestamp
                        amount
                    }
                }
            }
        `,
    });
    if (error) return [];
    else {
        const { borrowHistory, depositHistory } = data;
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
    });

    const queryTrancheChartData = useQuery({
        queryKey: ['subgraph-charts-asset'],
        queryFn: () => getTrancheChartData(trancheId),
    });

    return {
        queryTVLChartData,
        queryTrancheChartData,
    };
}

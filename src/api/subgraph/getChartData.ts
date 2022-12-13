import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '@utils/constants';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

const getTVLChartData = async () => {
    const { data, error } = await client.query({
        query: gql`
            query QueryProtocolTVL {
                tranches {
                    id
                    depositHistory {
                        amount
                        timestamp
                    }
                    borrowHistory {
                        amount
                        timestamp
                    }
                }
            }
        `,
    });

    console.log('getTVLChartData:', data);
};

export function useSubgraphChartData() {
    const queryTVLChartData = useQuery({
        queryKey: ['subgraph-charts-tvl'],
        queryFn: () => getTVLChartData(),
    });

    return {
        queryTVLChartData,
    };
}

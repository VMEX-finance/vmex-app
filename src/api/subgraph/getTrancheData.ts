import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

export const getTrancheAssetData = async (_trancheId: string | number) => {
    if (!_trancheId) return {};

    const trancheId = String(_trancheId);
    const { data, error } = await client.query({
        query: gql`
            query QueryTranche($trancheId: String!) {
                tranche(id: $trancheId) {
                    reserves {
                        symbol
                        baseLTVasCollateral
                        utilizationRate
                        reserveFactor
                        optimalUtilisationRate
                        decimals
                        variableBorrowRate
                        liquidityRate
                        reserveLiquidationThreshold
                        totalDeposits
                        availableLiquidity
                    }
                }
            }
        `,
        variables: { trancheId },
    });

    if (error) return {};
    console.log('getTrancheChartData:', data.tranche);
    return data.tranche;
};

export function useSubgraphTrancheData(trancheId: string | number) {
    console.log(trancheId);
    const queryTrancheAssetData = useQuery({
        queryKey: ['subgraph-asset-stats'],
        queryFn: () => getTrancheAssetData(trancheId),
    });

    return {
        queryTrancheAssetData,
    };
}

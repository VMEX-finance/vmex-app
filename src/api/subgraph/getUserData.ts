import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { IGraphUserDataProps, ISubgraphUserData } from './types';
import { utils } from 'ethers';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

export const getSubgraphUserData = async (address: string): Promise<IGraphUserDataProps> => {
    if (!address) return {};
    const { data, error } = await client.query({
        query: gql`
            query QueryTranche($address: String!) {
                user(id: $address) {
                    unclaimedRewards
                    depositHistory {
                        amount
                        timestamp
                        txHash
                        action
                        reserve {
                            symbol
                            decimals
                        }
                    }
                    borrowHistory {
                        amount
                        timestamp
                        txHash
                        action
                        reserve {
                            symbol
                            decimals
                        }
                    }
                    repayHistory {
                        amount
                        timestamp
                        txHash
                        action
                        reserve {
                            symbol
                            decimals
                        }
                    }
                }
            }
        `,
        variables: { address },
    });

    if (error) return {};
    else {
        return data;
    }
};

export function useSubgraphUserData(address: string): ISubgraphUserData {
    const queryUserData = useQuery({
        queryKey: ['subgraph-user-data'],
        queryFn: () => getSubgraphUserData(address),
    });

    return {
        queryUserData,
    };
}

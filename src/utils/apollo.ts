import { ApolloClient, InMemoryCache } from '@apollo/client';
import { DEFAULT_NETWORK, NETWORKS } from './network';
import { getNetwork } from '@wagmi/core';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                user: {
                    merge(existing, incoming) {
                        return incoming;
                    },
                },
            },
        },
    },
});

export const apolloClient = new ApolloClient({
    uri: NETWORKS[process.env.REACT_APP_NETWORK || DEFAULT_NETWORK].subgraph,
    cache: cache,
});

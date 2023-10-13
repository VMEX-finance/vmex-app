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

export const getApolloClient = () => {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
    return new ApolloClient({
        uri: NETWORKS[network].subgraph,
        cache: cache,
    });
};

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NETWORKS, getNetworkName } from '../utils/network';

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
    const network = getNetworkName();
    return new ApolloClient({
        uri: NETWORKS[network].subgraph,
        cache: cache,
    });
};

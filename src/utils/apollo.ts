import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SUBGRAPH_ENDPOINT } from './constants';

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
    uri: SUBGRAPH_ENDPOINT,
    cache: cache,
});

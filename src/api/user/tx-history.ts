import { useQuery } from '@tanstack/react-query';
import { getApolloClient, nativeTokenFormatter } from '../../utils';
import { formatUnits } from 'ethers/lib/utils.js';
import { NETWORKS, DEFAULT_NETWORK } from '../../utils';
import { getNetwork } from '@wagmi/core';
import { gql } from '@apollo/client';

// Gets
export async function getUserTxHistory(userAddress?: string) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    if (!userAddress) {
        return [];
    }
    const { data, error } = await getApolloClient().query({
        query: gql`
            query QueryTranche($userAddress: String!) {
                deposits(where: { user: $userAddress }) {
                    tranche {
                        id
                    }
                    reserve {
                        symbol
                    }
                    amount
                    txHash
                    timestamp
                }
                borrows(where: { user: $userAddress }) {
                    tranche {
                        id
                    }
                    reserve {
                        symbol
                    }
                    amount
                    txHash
                    timestamp
                }
            }
        `,
        variables: { userAddress },
    });
    console.log('tx history data', data);
    return [];
}

// Master
export function useUserHistory(userAddress?: string) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const queryUserTxHistory = useQuery({
        queryKey: [`user-tx-history`, userAddress, network],
        queryFn: () => getUserTxHistory(userAddress?.toLowerCase()),
        enabled: !!userAddress,
    });

    return {
        queryUserTxHistory,
    };
}

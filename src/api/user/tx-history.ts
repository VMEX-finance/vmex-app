import { useQuery } from '@tanstack/react-query';
import { getApolloClient, DEFAULT_NETWORK, unixToDate, sortArrByDate } from '@/utils';
import { getNetwork } from '@wagmi/core';
import { gql } from '@apollo/client';
import { ethers } from 'ethers';
import { IUserTxHistoryProps } from './types';

// Gets
export async function getUserTxHistory(userAddress?: string) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    if (!userAddress) {
        return [];
    }
    const { data, error, errors } = await getApolloClient().query({
        query: gql`
            query QueryTranche($userAddress: String!) {
                deposits(where: { user: $userAddress }, orderBy: timestamp, orderDirection: desc) {
                    tranche {
                        id
                    }
                    reserve {
                        symbol
                        decimals
                    }
                    amount
                    txHash
                    timestamp
                }
                borrows(where: { user: $userAddress }, orderBy: timestamp, orderDirection: desc) {
                    tranche {
                        id
                    }
                    reserve {
                        symbol
                        decimals
                    }
                    amount
                    txHash
                    timestamp
                }
            }
        `,
        variables: { userAddress },
    });
    if (error || errors) console.error('#getUserTxHistory', error || errors);
    if (data) {
        const deposits: IUserTxHistoryProps[] = data.deposits.map((d: any) => ({
            datetime: unixToDate(d.timestamp),
            type: 'Deposit',
            asset: d.reserve.symbol.replace(/\d+$/, ''),
            amount: ethers.utils.formatUnits(d.amount, d.reserve.decimals),
            txHash: d.txHash,
        }));
        const borrows: IUserTxHistoryProps[] = data.borrows.map((b: any) => ({
            datetime: unixToDate(b.timestamp),
            type: 'Borrow',
            asset: b.reserve.symbol.replace(/\d+$/, ''),
            amount: ethers.utils.formatUnits(b.amount, b.reserve.decimals),
            txHash: b.txHash,
        }));
        return sortArrByDate([...deposits, ...borrows]) as IUserTxHistoryProps[];
    }
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

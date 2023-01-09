import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { IGraphUserDataProps, ISubgraphUserData } from './types';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { BigNumber, utils } from 'ethers';
import { getAllAssetPrices } from '../prices';
import { nativeAmountToUSD } from '../../utils/sdk-helpers';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

type BalanceHistoryItem = {
    timestamp: number;
    aTokenBalance: string;
    debtTokenBalance: string;
    reserveSymbol: string;
    reserveDecimals: number;
};

export const getSubgraphUserChart = async (
    address: string,
): Promise<ILineChartDataPointProps[]> => {
    if (!address) return [];
    address = address.toLowerCase();
    const { data, error } = await client.query({
        query: gql`
            query QueryUserChart($address: String!) {
                user(id: $address) {
                    reserves {
                        reserve {
                            assetData {
                                underlyingAssetName
                            }
                            decimals
                        }
                        pnlHistory(first: 100, orderBy: timestamp, orderDirection: asc) {
                            timestamp
                            currentATokenBalance
                            currentVariableDebt
                        }
                    }
                }
            }
        `,
        variables: { address },
    });

    if (error || !data.user) return [];
    else {
        let allReserves = data.user.reserves;
        let graphData: ILineChartDataPointProps[] = [];
        const prices = await getAllAssetPrices();

        const allPnLHistory: BalanceHistoryItem[] = [];

        allReserves.map((reserve: any) => {
            reserve.pnlHistory.map((pnlItem: any) => {
                allPnLHistory.push({
                    timestamp: pnlItem.timestamp,
                    aTokenBalance: pnlItem.currentATokenBalance,
                    debtTokenBalance: pnlItem.currentVariableDebt,
                    reserveSymbol: reserve.reserve.assetData.underlyingAssetName,
                    reserveDecimals: reserve.reserve.decimals,
                });
            });
        });

        allPnLHistory.sort(
            (a: BalanceHistoryItem, b: BalanceHistoryItem) => a.timestamp - b.timestamp,
        );

        const reserveCurrentValues: Map<string, number> = new Map();
        allPnLHistory.map((pnlItem: BalanceHistoryItem, idx: number) => {
            // TODO: add congregation for days
            const date = new Date(pnlItem.timestamp * 1000).toLocaleString();
            const valueNative = BigNumber.from(pnlItem.aTokenBalance).sub(
                BigNumber.from(pnlItem.debtTokenBalance),
            );

            const assetUSDPrice = (prices as any)[pnlItem.reserveSymbol].usdPrice;

            const value = nativeAmountToUSD(
                valueNative.toString(),
                pnlItem.reserveDecimals,
                assetUSDPrice,
            );

            if (idx === 0) {
                graphData.push({
                    xaxis: date,
                    value: value,
                });
                reserveCurrentValues.set(pnlItem.reserveSymbol, value);
            } else {
                let pnl = graphData.at(-1)?.value || 0;
                pnl -= reserveCurrentValues.get(pnlItem.reserveSymbol) || 0;
                pnl += value;
                graphData.push({
                    xaxis: date,
                    value: pnl,
                });
                reserveCurrentValues.set(pnlItem.reserveSymbol, value);
            }
        });

        console.log('getSubgraphUserChart:', graphData);
        return graphData;
    }
};

export const getSubgraphUserData = async (address: string): Promise<IGraphUserDataProps> => {
    if (!address) return {};
    address = address.toLowerCase();
    const { data, error } = await client.query({
        query: gql`
            query QueryUserData($address: String!) {
                user(id: $address) {
                    unclaimedRewards
                    depositHistory {
                        amount
                        timestamp
                        txHash
                        action
                        reserve {
                            assetData {
                                underlyingAssetName
                            }
                            decimals
                        }
                    }
                    borrowHistory {
                        amount
                        timestamp
                        txHash
                        action
                        reserve {
                            assetData {
                                underlyingAssetName
                            }
                            decimals
                        }
                    }
                    repayHistory {
                        amount
                        timestamp
                        txHash
                        action
                        reserve {
                            assetData {
                                underlyingAssetName
                            }
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
        const returnObj = data;
        console.log('getSubgraphUserData:', returnObj);
        return returnObj;
    }
};

export function useSubgraphUserData(address?: `0x${string}`): ISubgraphUserData {
    const queryUserPnlChart = useQuery({
        queryKey: ['subgraph-user-pnl-chart'],
        queryFn: () => getSubgraphUserChart(address || ''),
        refetchInterval: 1 * 60 * 1000, // Refetch every minute
        enabled: !!address,
    });

    const queryUserData = useQuery({
        queryKey: ['subgraph-user-data'],
        queryFn: () => getSubgraphUserData(address || ''),
        enabled: !!address,
    });

    return {
        queryUserPnlChart,
        queryUserData,
    };
}

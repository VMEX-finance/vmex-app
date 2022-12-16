import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { bigNumberToUSD, DECIMALS } from '../../utils/sdk-helpers';
import { IGraphProtocolDataProps, IGraphTrancheProps, ISubgraphProtocolData } from './types';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

export const getSubgraphProtocolChart = async (): Promise<ILineChartDataPointProps[] | any> => {
    const { data, error } = await client.query({
        query: gql`
            query QueryProtocolTVL {
                tranches {
                    id
                    borrowHistory {
                        timestamp
                        amount
                        assetPriceUSD
                        reserve {
                            symbol
                        }
                    }
                    depositHistory {
                        timestamp
                        amount
                        assetPriceUSD
                        reserve {
                            symbol
                        }
                    }
                }
            }
        `,
    });
    if (error) return [];
    else {
        let graphData: ILineChartDataPointProps[] = [];
        data.tranches.map((tranche: IGraphTrancheProps) => {
            tranche.depositHistory.map((el) => {
                const asset = el.reserve.symbol.slice(0, -1);
                // TODO: fix to be in terms of USD, not native amounts (use oracles)
                const usdAmount = parseFloat(
                    bigNumberToUSD(el.amount, DECIMALS.get(asset) || 18, false),
                );
                const date = new Date(el.timestamp * 1000).toLocaleDateString();

                if (graphData.length === 0)
                    graphData.push({ asset, value: usdAmount, xaxis: date });
                else {
                    graphData.map((plot) => {
                        if (plot.xaxis === date) {
                            plot.value = plot.value + usdAmount;
                        } else {
                            graphData.push({ asset, value: usdAmount, xaxis: date });
                        }
                    });
                }
            });

            tranche.borrowHistory.map((el) => {
                const asset = el.reserve.symbol.slice(0, -1);
                // TODO: fix to be in terms of USD, not native amounts (use oracles)
                // Multiply this 'amount' by 'assetPriceUSD' when oracle is connected
                const usdAmount = parseFloat(
                    bigNumberToUSD(el.amount, DECIMALS.get(asset) || 18, false),
                );
                const date = new Date(el.timestamp * 1000).toLocaleDateString();

                graphData.map((plot) => {
                    if (plot.xaxis === date) {
                        plot.value = plot.value - usdAmount;
                    } else {
                        graphData.push({ asset, value: -usdAmount, xaxis: date });
                    }
                });
            });
        });

        // Loop through and add previous day TVL to current day TVL
        graphData.forEach(function (plot, index) {
            if (index > 0) {
                plot.value = plot.value + graphData[index - 1].value;
            }
        });
        console.log('getSubgraphProtocolChart:', graphData);
        return graphData;
    }
};

// TODO
export async function getSubgraphProtocolData(): Promise<IGraphProtocolDataProps> {
    const { data, error } = await client.query({
        query: gql`
            query QueryProtocolData {
                deposits {
                    user {
                        id
                    }
                }
                borrows {
                    user {
                        id
                    }
                }
            }
        `,
    });
    if (error) return {};
    else {
        const uniqueBorrowers: string[] = [];
        const uniqueLenders: string[] = [];
        // History of all users that have borrowed or deposited - NOT JUST CURRENT
        data.borrows.map(({ user }: any) => {
            if (uniqueBorrowers.includes(user.id) === false) uniqueBorrowers.push(user.id);
        });
        data.deposits.map(({ user }: any) => {
            if (uniqueLenders.includes(user.id) === false) uniqueLenders.push(user.id);
        });

        const returnObj = {
            uniqueBorrowers,
            uniqueLenders,
        };
        console.log('getSubgraphProtocolData:', returnObj);
        return returnObj;
    }
}

export function useSubgraphProtocolData(): ISubgraphProtocolData {
    const queryProtocolTVLChart = useQuery({
        queryKey: ['subgraph-protocol-charts'],
        queryFn: () => getSubgraphProtocolChart(),
        refetchInterval: 1 * 60 * 1000, // Refetch every minute
    });

    const queryProtocolData = useQuery({
        queryKey: ['subgraph-protocol-data'],
        queryFn: () => getSubgraphProtocolData(),
    });

    return {
        queryProtocolTVLChart,
        queryProtocolData,
    };
}

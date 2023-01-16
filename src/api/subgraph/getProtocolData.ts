import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { IAvailableCoins, usdFormatter } from '../../utils/helpers';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { nativeAmountToUSD } from '../../utils/sdk-helpers';
import { getAllAssetPrices } from '../prices';
import { AssetBalance, TrancheData } from '../types';
import { IGraphProtocolDataProps, IGraphTrancheProps, ISubgraphProtocolData } from './types';
import { getSubgraphTranchesOverviewData } from './getTranchesOverviewData';
import { IAssetPricesProps } from '../prices/types';

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
                    borrowHistory(orderBy: timestamp, orderDirection: asc) {
                        timestamp
                        amount
                        reserve {
                            assetData {
                                underlyingAssetName
                            }
                            decimals
                        }
                    }
                    depositHistory(orderBy: timestamp, orderDirection: asc) {
                        timestamp
                        amount
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
    });
    if (error) return [];
    else {
        let graphData: ILineChartDataPointProps[] = [];
        const prices = await getAllAssetPrices();
        data.tranches.map((tranche: IGraphTrancheProps) => {
            tranche.depositHistory.map((el) => {
                const asset = el.reserve.assetData.underlyingAssetName;

                const assetUSDPrice = (prices as any)[asset].usdPrice;
                const usdAmount = nativeAmountToUSD(el.amount, el.reserve.decimals, assetUSDPrice);
                const date = new Date(el.timestamp * 1000).toLocaleString();

                const found = graphData.find((element) => element.xaxis === date);
                if (found) {
                    found.value = found.value + usdAmount;
                } else {
                    graphData.push({ value: usdAmount, xaxis: date });
                }
            });

            tranche.borrowHistory.map((el) => {
                const asset = el.reserve.assetData.underlyingAssetName;
                const assetUSDPrice = (prices as any)[asset].usdPrice;
                const usdAmount = nativeAmountToUSD(el.amount, el.reserve.decimals, assetUSDPrice);
                const date = new Date(el.timestamp * 1000).toLocaleString();

                const found = graphData.find((element) => element.xaxis === date);
                if (found) {
                    found.value = found.value + usdAmount;
                } else {
                    graphData.push({ value: usdAmount, xaxis: date });
                }
            });
        });

        // Loop through and add previous day TVL to current day TVL
        graphData.forEach(function (plot, index) {
            if (index > 0) {
                plot.value = plot.value + graphData[index - 1].value;
            }
        });
        return graphData.sort((a, b) => new Date(a.xaxis).valueOf() - new Date(b.xaxis).valueOf());
    }
};

async function getTopSuppliedAssets(
    _prices?: Record<IAvailableCoins, IAssetPricesProps>,
): Promise<AssetBalance[]> {
    const { data, error } = await client.query({
        query: gql`
            query QueryTopSuppliedAssets {
                reserves(first: 5, orderBy: totalDeposits, orderDirection: desc) {
                    assetData {
                        underlyingAssetName
                    }
                    totalDeposits
                    decimals
                }
            }
        `,
    });
    if (error) return [];

    let prices: Record<IAvailableCoins, IAssetPricesProps>;
    if (_prices) prices = _prices;
    else prices = await getAllAssetPrices();

    const result: { asset: string; amount: number }[] = Object.values(
        data.reserves.reduce((r: any, reserve: any) => {
            const _asset = reserve.assetData.underlyingAssetName;
            const _assetUSDPrice = (prices as any)[_asset].usdPrice;
            const _usdAmount = nativeAmountToUSD(
                reserve.totalDeposits,
                reserve.decimals,
                _assetUSDPrice,
            );

            r[_asset] ??= { asset: _asset, amount: 0 };
            r[_asset].amount += _usdAmount;
            return r;
        }, {}),
    );

    return result
        .sort((a, b) => b.amount - a.amount)
        .map((el: any) => ({ ...el, amount: usdFormatter(false).format(el.amount) }));
}

async function getTopBorrowedAssets(
    _prices?: Record<IAvailableCoins, IAssetPricesProps>,
): Promise<AssetBalance[]> {
    const { data, error } = await client.query({
        query: gql`
            query QueryTopBorrowedAssets {
                reserves(first: 5, orderBy: totalCurrentVariableDebt, orderDirection: desc) {
                    assetData {
                        underlyingAssetName
                    }
                    totalCurrentVariableDebt
                    decimals
                }
            }
        `,
    });
    if (error) return [];

    let prices: Record<IAvailableCoins, IAssetPricesProps>;
    if (_prices) prices = _prices;
    else prices = await getAllAssetPrices();

    const result: { asset: string; amount: number }[] = Object.values(
        data.reserves.reduce((r: any, reserve: any) => {
            const _asset = reserve.assetData.underlyingAssetName;
            const _assetUSDPrice = (prices as any)[_asset].usdPrice;
            const _usdAmount = nativeAmountToUSD(
                reserve.totalCurrentVariableDebt,
                reserve.decimals,
                _assetUSDPrice,
            );
            r[_asset] ??= { asset: _asset, amount: 0 };
            r[_asset].amount += _usdAmount;
            return r;
        }, {}),
    );

    return result
        .sort((a, b) => b.amount - a.amount)
        .map((el: any) => ({ ...el, amount: usdFormatter(false).format(el.amount) }));
}

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
                reserves {
                    id
                }
            }
        `,
    });
    if (error) return {};

    const uniqueBorrowers: string[] = [];
    const uniqueLenders: string[] = [];
    // History of all users that have borrowed or deposited - NOT JUST CURRENT
    data.borrows.map(({ user }: any) => {
        if (uniqueBorrowers.includes(user.id) === false) uniqueBorrowers.push(user.id);
    });
    data.deposits.map(({ user }: any) => {
        if (uniqueLenders.includes(user.id) === false) uniqueLenders.push(user.id);
    });

    const allTrancheData = await getSubgraphTranchesOverviewData();
    const topTranches: TrancheData[] = [];
    allTrancheData.sort((a, b) => {
        let c = a.tvl ? Number(a.tvl) : 0;
        let d = b.tvl ? Number(b.tvl) : 0;
        return c - d;
    });

    let tvl = 0,
        totalSupplied = 0,
        totalBorrowed = 0;
    allTrancheData.map((el) => {
        if (topTranches.length < 5) {
            topTranches.push({
                name: el.name || '-',
                totalBorrowed: el.borrowTotal?.toString() || '-',
                totalSupplied: el.supplyTotal?.toString() || '-',
            });
        }

        tvl += Number(el.tvl) || 0;
        totalBorrowed += Number(el.borrowTotal) || 0;
        totalSupplied += Number(el.supplyTotal) || 0;
    });

    const prices = await getAllAssetPrices();

    const returnObj = {
        uniqueBorrowers: uniqueBorrowers,
        uniqueLenders: uniqueLenders,
        markets: data.reserves.length,
        topSuppliedAssets: await getTopSuppliedAssets(prices),
        topBorrowedAssets: await getTopBorrowedAssets(prices),
        topTranches: topTranches.reverse(),
        tvl: usdFormatter(false).format(tvl),
        reserve: usdFormatter().format(tvl),
        totalBorrowed: usdFormatter(false).format(totalBorrowed),
        totalSupplied: usdFormatter(false).format(totalSupplied),
    };

    return returnObj;
}

export function useSubgraphProtocolData(): ISubgraphProtocolData {
    const queryProtocolTVLChart = useQuery({
        queryKey: ['protocol-charts'],
        queryFn: () => getSubgraphProtocolChart(),
        refetchInterval: 1 * 60 * 1000, // Refetch every minute
    });

    const queryProtocolData = useQuery({
        queryKey: ['protocol-data'],
        queryFn: () => getSubgraphProtocolData(),
    });

    return {
        queryProtocolTVLChart,
        queryProtocolData,
    };
}

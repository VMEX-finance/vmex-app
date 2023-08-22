import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ILineChartDataPointProps } from '@ui/components/charts';
import {
    nativeAmountToUSD,
    IAvailableCoins,
    usdFormatter,
    apolloClient,
    PRICING_DECIMALS,
    NETWORK,
} from '../../utils';
import { getAllAssetPrices } from '../prices';
import { AssetBalance, TrancheData } from '../types';
import { IGraphProtocolDataProps, IGraphTrancheProps, ISubgraphProtocolData } from './types';
import { getSubgraphTranchesOverviewData } from './getTranchesOverviewData';
import { IAssetPricesProps } from '../prices/types';

function subtractSeconds(date: Date, seconds: number): Date {
    date.setSeconds(date.getSeconds() - seconds);

    return date;
}

export const getSubgraphProtocolChart = async (): Promise<ILineChartDataPointProps[] | any> => {
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryProtocolTVL {
                tranches {
                    id
                    redeemUnderlyingHistory(orderBy: timestamp, orderDirection: asc) {
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

    let graphData: ILineChartDataPointProps[] = [];
    const prices = await getAllAssetPrices();
    data.tranches.map((tranche: IGraphTrancheProps) => {
        tranche?.depositHistory?.map((el) => {
            const asset = el.reserve.assetData.underlyingAssetName.toUpperCase();

            const assetUSDPrice = (prices as any)[asset]?.usdPrice || '0';
            const usdAmount = nativeAmountToUSD(
                el.amount,
                PRICING_DECIMALS[NETWORK],
                el.reserve.decimals,
                assetUSDPrice,
            );
            const date = new Date(el.timestamp * 1000).toLocaleString();

            graphData.push({ value: usdAmount, xaxis: date });
        });

        tranche?.redeemUnderlyingHistory?.map((el) => {
            const asset = el.reserve.assetData.underlyingAssetName.toUpperCase();
            const assetUSDPrice = (prices as any)[asset]?.usdPrice || '0';
            const usdAmount =
                nativeAmountToUSD(
                    el.amount,
                    PRICING_DECIMALS[NETWORK],
                    el.reserve.decimals,
                    assetUSDPrice,
                ) * -1;
            const date = new Date(el.timestamp * 1000).toLocaleString();
            graphData.push({ value: usdAmount, xaxis: date });
        });
    });

    graphData.sort((a, b) => new Date(a.xaxis).valueOf() - new Date(b.xaxis).valueOf());
    if (graphData.length > 0) {
        // add a zero to the very beginning
        graphData.unshift({
            value: 0,
            xaxis: subtractSeconds(new Date(graphData[0].xaxis), 24 * 60 * 60).toLocaleString(),
        });
    }

    // Loop through and add previous day TVL to current day TVL
    graphData.forEach(function (plot, index) {
        if (index > 0) {
            plot.value = (plot.value || 0) + (graphData[index - 1].value || 0);
        }
    });
    return graphData;
};

async function getTopAssets(
    _prices?: Record<IAvailableCoins, IAssetPricesProps>,
): Promise<AssetBalance[][]> {
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryTopSuppliedAssets {
                reserves(where: { symbol_not: "" }) {
                    assetData {
                        underlyingAssetName
                    }
                    totalDeposits
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

    const resultSupplied: { asset: string; amount: number }[] = Object.values(
        data.reserves.reduce((r: any, reserve: any) => {
            const _asset = reserve.assetData.underlyingAssetName.toUpperCase();
            if (!(prices as any)[_asset]) {
                console.warn(
                    'MISSING ORACLE PRICE FOR',
                    _asset,
                    'skipping asset in any usd calculations',
                );
                r[_asset] ??= { asset: _asset, amount: 0 };
                return r;
            }
            const _assetUSDPrice = (prices as any)[_asset]?.usdPrice || '0';
            const _usdAmount = nativeAmountToUSD(
                reserve.totalDeposits,
                PRICING_DECIMALS[NETWORK],
                reserve.decimals,
                _assetUSDPrice,
            );

            r[_asset] ??= { asset: _asset, amount: 0 };
            r[_asset].amount += _usdAmount;
            return r;
        }, {}),
    );

    const resultBorrowed: { asset: string; amount: number }[] = Object.values(
        data.reserves.reduce((r: any, reserve: any) => {
            const _asset = reserve.assetData.underlyingAssetName.toUpperCase();
            if (!(prices as any)[_asset]) {
                console.warn(
                    'MISSING ORACLE PRICE FOR',
                    _asset,
                    'skipping asset in any usd calculations',
                );
                r[_asset] ??= { asset: _asset, amount: 0 };
                return r;
            }
            const _assetUSDPrice = (prices as any)[_asset]?.usdPrice || '0';
            const _usdAmount = nativeAmountToUSD(
                reserve.totalCurrentVariableDebt,
                PRICING_DECIMALS[NETWORK],
                reserve.decimals,
                _assetUSDPrice,
            );
            r[_asset] ??= { asset: _asset, amount: 0 };
            r[_asset].amount += _usdAmount;
            return r;
        }, {}),
    );

    return [
        resultSupplied
            .sort((a, b) => b.amount - a.amount)
            .map((el: any) => ({ ...el, amount: usdFormatter(false).format(el.amount) })),
        resultBorrowed
            .sort((a, b) => b.amount - a.amount)
            .map((el: any) => ({ ...el, amount: usdFormatter(false).format(el.amount) })),
    ];
}

export async function getSubgraphProtocolData(): Promise<IGraphProtocolDataProps> {
    const { data, error } = await apolloClient.query({
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

    const uniqueBorrowers = new Set<string>();
    const uniqueLenders = new Set<string>();
    // History of all users that have borrowed or deposited - NOT JUST CURRENT
    data.borrows.forEach(({ user }: any) => {
        uniqueBorrowers.add(user.id);
    });
    data.deposits.forEach(({ user }: any) => {
        uniqueLenders.add(user.id);
    });

    const allTrancheData = await getSubgraphTranchesOverviewData();
    const topTranches: TrancheData[] = [];
    allTrancheData.sort((a, b) => {
        let c = a.tvl ? Number(a.tvl) : 0;
        let d = b.tvl ? Number(b.tvl) : 0;
        return d - c;
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
    const topAssets = await getTopAssets(prices);

    const returnObj = {
        uniqueBorrowers: uniqueBorrowers.size,
        uniqueLenders: uniqueLenders.size,
        markets: data.reserves.length,
        topSuppliedAssets: topAssets[0],
        topBorrowedAssets: topAssets[1],
        topTranches: topTranches,
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

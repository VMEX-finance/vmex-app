import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { IGraphAssetData, IGraphTrancheDataProps, ISubgraphTrancheData } from './types';
import { utils } from 'ethers';
import { getAllAssetPrices } from '../prices';
import {
    usdFormatter,
    percentFormatter,
    apolloClient,
    nativeAmountToUSD,
    weightedAverageofArr,
    MAX_UINT_AMOUNT,
    IAvailableCoins,
} from '../../utils';
import { ILineChartDataPointProps } from '../../ui/components';

export const processTrancheData = async (
    data: any,
    trancheId?: string,
): Promise<IGraphTrancheDataProps> => {
    const assets = data.reserves;
    const prices = await getAllAssetPrices();
    const assetsData = assets.reduce(
        (obj: any, item: any) =>
            Object.assign(obj, {
                [item.assetData.underlyingAssetName]: {
                    liquidity: item.availableLiquidity,
                    decimals: item.decimals,
                    ltv: item.assetData.baseLTV,
                    optimalUtilityRate: percentFormatter.format(
                        parseFloat(utils.formatUnits(item.optimalUtilisationRate, 27)),
                    ),
                    reserveFactor: item.reserveFactor,
                    vmexReserveFactor: item.assetData.vmexReserveFactor,
                    liquidationThreshold: item.assetData.liquidationThreshold,
                    utilityRate: `${item.utilizationRate}`,
                    borrowRate: percentFormatter.format(
                        Number(utils.formatUnits(item.variableBorrowRate, 27)),
                    ),
                    supplyRate: percentFormatter.format(
                        Number(utils.formatUnits(item.liquidityRate, 27)),
                    ),
                    collateral: item.usageAsCollateralEnabled,
                    canBeBorrowed: item.borrowingEnabled,
                    oracle: 'Chainlink', // TODO: map to human readable name // (prices as any)[item.assetData.underlyingAssetName].oracle
                    totalSupplied: utils.formatUnits(item.totalDeposits, item.decimals),
                    totalBorrowed: utils.formatUnits(item.totalCurrentVariableDebt, item.decimals),
                    totalCollateral: utils.formatUnits(
                        item.totalLiquidityAsCollateral,
                        item.decimals,
                    ),
                    baseLTV: item.assetData.baseLTV,
                    liquidationBonus: item.assetData.liquidationBonus,
                    borrowFactor: item.assetData.borrowFactor,
                    borrowCap:
                        item.assetData.borrowCap == '0'
                            ? MAX_UINT_AMOUNT
                            : item.assetData.borrowCap,
                    supplyCap:
                        item.assetData.supplyCap == '0'
                            ? MAX_UINT_AMOUNT
                            : item.assetData.borrowCap,
                    priceUSD: (prices as any)[item.assetData.underlyingAssetName].usdPrice,
                    priceETH: (prices as any)[item.assetData.underlyingAssetName].ethPrice,
                    isFrozen: item.isFrozen,
                    // yieldStrategy: item.yieldStrategy,
                },
            }),
        {},
    );

    const summaryData = assets.reduce(
        (obj: any, item: any) => {
            const asset = item.assetData.underlyingAssetName;
            const assetUSDPrice = (prices as any)[asset].usdPrice;

            return Object.assign(obj, {
                tvl:
                    obj.tvl +
                    nativeAmountToUSD(item.availableLiquidity, item.decimals, assetUSDPrice),
                supplyTotal:
                    obj.supplyTotal +
                    nativeAmountToUSD(item.totalDeposits, item.decimals, assetUSDPrice),
                borrowTotal:
                    obj.borrowTotal +
                    nativeAmountToUSD(item.totalCurrentVariableDebt, item.decimals, assetUSDPrice),
                collateralTotal:
                    obj.collateralTotal +
                    nativeAmountToUSD(
                        item.totalLiquidityAsCollateral,
                        item.decimals,
                        assetUSDPrice,
                    ),
            });
        },
        {
            tvl: 0,
            supplyTotal: 0,
            borrowTotal: 0,
            collateralTotal: 0,
        },
    );

    const calculateAvgApy = () => {
        const supplyApys: number[] = [];
        const liquidities: number[] = [];
        assets.map((el: any) => {
            supplyApys.push(Number(utils.formatUnits(el.liquidityRate, 27)));
            liquidities.push(Number(utils.formatUnits(el.availableLiquidity, el.decimals)));
        });
        return weightedAverageofArr(supplyApys, liquidities);
    };

    const uniqueBorrowers = new Set<string>();
    const uniqueLenders = new Set<string>();

    data.depositHistory.forEach((el: any) => {
        uniqueLenders.add(el.user.id);
    });
    data.borrowHistory.forEach((el: any) => {
        uniqueBorrowers.add(el.user.id);
    });

    const returnObj = {
        assetsData,
        assets: assets.map((el: any) => el.assetData.underlyingAssetName as IAvailableCoins),
        id: trancheId ? trancheId : data.id,
        name: data.name,
        admin: data.trancheAdmin.id,
        availableLiquidity: usdFormatter().format(summaryData.tvl),
        totalSupplied: usdFormatter().format(summaryData.supplyTotal),
        totalBorrowed: usdFormatter().format(summaryData.borrowTotal),
        totalCollateral: usdFormatter().format(
            summaryData.supplyTotal - summaryData.collateralTotal,
        ), // TODO: is this right for total collateral since subgraph only provides collateral liquidity?
        tvl: usdFormatter().format(summaryData.tvl),
        poolUtilization: percentFormatter.format(
            1 - (summaryData.supplyTotal - summaryData.borrowTotal) / summaryData.supplyTotal,
        ),
        avgApy: calculateAvgApy(),
        whitelist: data.isUsingWhitelist,
        whitelistedUsers: data.whitelistedUsers.map((obj: any) => {
            return obj.id;
        }),
        blacklistedUsers: data.blacklistedUsers.map((obj: any) => {
            return obj.id;
        }),
        isPaused: false, // TODO
        treasury: data.treasury,
        uniqueBorrowers: uniqueBorrowers.size,
        uniqueLenders: uniqueLenders.size,
    };
    return returnObj;
};

export const getSubgraphTrancheData = async (
    _trancheId: number,
): Promise<IGraphTrancheDataProps> => {
    if (!_trancheId) return {};

    const trancheId = String(_trancheId);
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryTranche($trancheId: String!) {
                tranche(id: $trancheId) {
                    name
                    isUsingWhitelist
                    treasury
                    trancheAdmin {
                        id
                    }
                    whitelistedUsers {
                        id
                    }
                    blacklistedUsers {
                        id
                    }
                    reserves {
                        totalLiquidityAsCollateral
                        utilizationRate
                        reserveFactor
                        optimalUtilisationRate
                        decimals
                        isActive
                        variableBorrowRate
                        liquidityRate
                        totalDeposits
                        availableLiquidity
                        totalCurrentVariableDebt
                        usageAsCollateralEnabled
                        borrowingEnabled
                        assetData {
                            underlyingAssetName
                            baseLTV
                            liquidationThreshold
                            liquidationBonus
                            borrowFactor
                            borrowCap
                            supplyCap
                            vmexReserveFactor
                        }
                        isFrozen
                        # yieldStrategy
                    }
                    depositHistory {
                        user {
                            id
                        }
                    }
                    borrowHistory {
                        user {
                            id
                        }
                    }
                }
            }
        `,
        variables: { trancheId },
    });

    if (error) return {};
    else return processTrancheData(data.tranche, trancheId);
};

export const getSubgraphTrancheChart = async (
    _trancheId: number,
): Promise<ILineChartDataPointProps[] | any> => {
    if (!_trancheId) return {};

    const trancheId = String(_trancheId);
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryTrancheChart($trancheId: String!) {
                tranche(id: $trancheId) {
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
        variables: { trancheId },
    });

    if (error) return [];
    else {
        let graphData: ILineChartDataPointProps[] = [];
        const prices = await getAllAssetPrices();
        data.tranche.depositHistory.map((el: any) => {
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

        data.tranche.borrowHistory.map((el: any) => {
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

        // Loop through and add previous day TVL to current day TVL
        graphData.forEach(function (plot, index) {
            if (index > 0) {
                plot.value = plot.value + graphData[index - 1].value;
            }
        });
        return graphData.sort((a, b) => new Date(a.xaxis).valueOf() - new Date(b.xaxis).valueOf());
    }
};

export function useSubgraphTrancheData(trancheId: number): ISubgraphTrancheData {
    const queryTrancheData = useQuery({
        queryKey: ['tranche-data', Number(trancheId)],
        queryFn: () => getSubgraphTrancheData(trancheId),
        enabled: !!trancheId,
    });

    const queryTrancheChart = useQuery({
        queryKey: ['tranche-chart', Number(trancheId)],
        queryFn: () => getSubgraphTrancheChart(trancheId),
        enabled: !!trancheId,
    });

    const findAssetInMarketsData = (asset: string) => {
        if (queryTrancheData.isLoading) return undefined;
        else {
            return (queryTrancheData.data?.assetsData as any)[asset];
        }
    };

    return {
        queryTrancheData,
        findAssetInMarketsData,
        queryTrancheChart,
    };
}

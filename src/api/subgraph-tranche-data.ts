import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { IGraphTrancheDataProps, ISubgraphTrancheData, IAssetApyProps } from './types';
import { utils } from 'ethers';
import { getAllAssetPrices } from './asset-prices';
import {
    usdFormatter,
    percentFormatter,
    nativeAmountToUSD,
    weightedAverageofArr,
    MAX_UINT_AMOUNT,
    IAvailableCoins,
    getTrancheCategory,
    PRICING_DECIMALS,
    findInObjArr,
    getNetworkName,
} from '@/utils';
import { getApolloClient } from '@/config';
import { ILineChartDataPointProps } from '@/ui/components';
import { getTrancheId } from './id-generation';
import { getAllAssetApys } from './asset-apy';

const useCustomRiskParams = (isVerified: boolean, item: any) => {
    return isVerified && item.borrowFactor !== '0';
};

export const processTrancheData = async (
    data: any,
    trancheId?: string,
    globalAdmin?: string,
    backendApys?: IAssetApyProps[],
): Promise<IGraphTrancheDataProps> => {
    const replaceSubgraphApy = (reserve: any) => {
        if (backendApys?.length) {
            const found = backendApys.find(
                (el) => el.asset?.toLowerCase() === reserve.assetData.id?.toLowerCase(),
            );
            if (found) {
                return (Number(found.totalApy) / 100).toString();
            }
        }
        return utils.formatUnits(reserve.liquidityRate, 27);
    };

    const assets = data?.reserves;
    const isVerified = data?.isVerified || false;
    const prices = await getAllAssetPrices();
    const assetsData = assets.reduce(
        (obj: any, item: any) =>
            Object.assign(obj, {
                [item.assetData.underlyingAssetName]: {
                    liquidity: item.availableLiquidity,
                    decimals: item.decimals,
                    optimalUtilityRate: percentFormatter.format(
                        parseFloat(utils.formatUnits(item.optimalUtilisationRate, 27)),
                    ),
                    reserveFactor: item.reserveFactor,
                    vmexReserveFactor: item.assetData.vmexReserveFactor,
                    utilityRate: `${item.utilizationRate}`,
                    borrowRate: Number(utils.formatUnits(item.variableBorrowRate, 27)),
                    supplyRate: replaceSubgraphApy(item),
                    collateral: item.usageAsCollateralEnabled,
                    canBeBorrowed: item.borrowingEnabled,
                    oracle: 'Chainlink', // TODO: map to human readable name // (prices as any)[item.assetData.underlyingAssetName].oracle
                    totalSupplied: utils.formatUnits(item.totalDeposits, item.decimals),
                    totalBorrowed: utils.formatUnits(item.totalCurrentVariableDebt, item.decimals),
                    totalCollateral: utils.formatUnits(
                        item.totalLiquidityAsCollateral,
                        item.decimals,
                    ),
                    baseLTV: useCustomRiskParams(isVerified, item)
                        ? item.baseLTV
                        : item.assetData.baseLTV,
                    liquidationThreshold: useCustomRiskParams(isVerified, item)
                        ? item.liquidationThreshold
                        : item.assetData.liquidationThreshold,
                    liquidationBonus: useCustomRiskParams(isVerified, item)
                        ? item.liquidationBonus
                        : item.assetData.liquidationBonus,
                    borrowFactor: useCustomRiskParams(isVerified, item)
                        ? item.borrowFactor
                        : item.assetData.borrowFactor,
                    borrowCap:
                        item.assetData.borrowCap == '0'
                            ? MAX_UINT_AMOUNT
                            : item.assetData.borrowCap,
                    supplyCap:
                        item.assetData.supplyCap == '0'
                            ? MAX_UINT_AMOUNT
                            : item.assetData.supplyCap,
                    priceUSD: (prices as any)[item.assetData.underlyingAssetName.toUpperCase()]
                        ?.usdPrice,
                    priceETH: (prices as any)[item.assetData.underlyingAssetName.toUpperCase()]
                        ?.ethPrice,
                    isFrozen: item.isFrozen,
                    // yieldStrategy: item.yieldStrategy,
                },
            }),
        {},
    );

    const network = getNetworkName();
    const summaryData = assets.reduce(
        (obj: any, item: any) => {
            const asset = item.assetData.underlyingAssetName.toUpperCase();
            if (!(prices as any)[asset]) {
                console.warn(
                    'MISSING ORACLE PRICE FOR',
                    asset,
                    'skipping asset in any usd calculations',
                );
                return obj;
            }
            const assetUSDPrice = (prices as any)[asset]?.usdPrice;

            return Object.assign(obj, {
                tvl:
                    obj.tvl +
                    nativeAmountToUSD(
                        item.availableLiquidity,
                        PRICING_DECIMALS[network],
                        item.decimals,
                        assetUSDPrice,
                    ),
                supplyTotal:
                    obj.supplyTotal +
                    nativeAmountToUSD(
                        item.totalDeposits,
                        PRICING_DECIMALS[network],
                        item.decimals,
                        assetUSDPrice,
                    ),
                borrowTotal:
                    obj.borrowTotal +
                    nativeAmountToUSD(
                        item.totalCurrentVariableDebt,
                        PRICING_DECIMALS[network],
                        item.decimals,
                        assetUSDPrice,
                    ),
                collateralTotal:
                    obj.collateralTotal +
                    nativeAmountToUSD(
                        item.totalLiquidityAsCollateral,
                        PRICING_DECIMALS[network],
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

    const calculateAvgApy = async () => {
        const supplyApys: number[] = [];
        const liquidities: number[] = [];
        assets.map((el: any) => {
            supplyApys.push(Number(replaceSubgraphApy(el)));
            liquidities.push(Number(utils.formatUnits(el.availableLiquidity, el.decimals)));
        });
        return weightedAverageofArr(supplyApys, liquidities);
    };

    const uniqueBorrowers = new Set<string>();
    const uniqueLenders = new Set<string>();

    data?.depositHistory?.forEach((el: any) => {
        uniqueLenders.add(el.user.id);
    });
    data?.borrowHistory?.forEach((el: any) => {
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
        totalCollateral: usdFormatter().format(summaryData.collateralTotal), // TODO: is this right for total collateral since subgraph only provides collateral liquidity?
        tvl: usdFormatter().format(summaryData.tvl),
        poolUtilization: percentFormatter.format(
            1 - (summaryData.supplyTotal - summaryData.borrowTotal) / summaryData.supplyTotal,
        ),
        avgApy: await calculateAvgApy(),
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
        category: getTrancheCategory(data, globalAdmin),
    };
    return returnObj;
};

export const getSubgraphTrancheData = async (
    _trancheId: number,
): Promise<IGraphTrancheDataProps> => {
    if (!_trancheId) return {};

    const trancheId = getTrancheId(String(_trancheId));
    const apyRes = await getAllAssetApys();
    const { data, error } = await getApolloClient().query({
        query: gql`
            query QueryTranche($trancheId: String!) {
                tranche(id: $trancheId) {
                    name
                    isUsingWhitelist
                    treasury
                    isVerified
                    trancheAdmin {
                        id
                    }
                    whitelistedUsers {
                        id
                    }
                    blacklistedUsers {
                        id
                    }
                    reserves(where: { symbol_not: "" }) {
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
                            id
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
                        baseLTV
                        liquidationThreshold
                        liquidationBonus
                        borrowFactor
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
                protocol(id: "1") {
                    globalAdmin
                }
            }
        `,
        variables: { trancheId },
    });

    if (error || !data.tranche) return {};
    else
        return processTrancheData(
            data.tranche,
            String(_trancheId),
            data.protocol.globalAdmin,
            apyRes,
        );
};

export const getSubgraphTrancheChart = async (
    _trancheId: number,
): Promise<ILineChartDataPointProps[] | any> => {
    if (!_trancheId) return {};
    const trancheId = getTrancheId(String(_trancheId));
    const { data, error } = await getApolloClient().query({
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
        const network = getNetworkName();
        let graphData: ILineChartDataPointProps[] = [];
        const prices = await getAllAssetPrices();
        data.tranche?.depositHistory?.map((el: any) => {
            const asset = el.reserve.assetData.underlyingAssetName.toUpperCase();
            if (!(prices as any)[asset]) {
                console.warn(
                    'MISSING ORACLE PRICE FOR',
                    asset,
                    'skipping asset in any usd calculations',
                );
                return;
            }

            const assetUSDPrice = (prices as any)[asset]?.usdPrice;
            const usdAmount = nativeAmountToUSD(
                el.amount,
                PRICING_DECIMALS[network],
                el.reserve.decimals,
                assetUSDPrice,
            );
            const date = new Date(el.timestamp * 1000).toLocaleString();

            const found = graphData.find((element) => element.xaxis === date);
            if (found) {
                found.value = (found.value || 0) + usdAmount;
            } else {
                graphData.push({ value: usdAmount, xaxis: date });
            }
        });

        data.tranche.borrowHistory.map((el: any) => {
            const asset = el.reserve.assetData.underlyingAssetName.toUpperCase();
            if (!(prices as any)[asset]) {
                console.warn(
                    'MISSING ORACLE PRICE FOR',
                    asset,
                    'skipping asset in any usd calculations',
                );
                return;
            }
            const assetUSDPrice = (prices as any)[asset]?.usdPrice;
            const usdAmount = nativeAmountToUSD(
                el.amount,
                PRICING_DECIMALS[network],
                el.reserve.decimals,
                assetUSDPrice,
            );
            const date = new Date(el.timestamp * 1000).toLocaleString();

            const found = graphData.find((element) => element.xaxis === date);
            if (found) {
                found.value = (found.value || 0) + usdAmount;
            } else {
                graphData.push({ value: usdAmount, xaxis: date });
            }
        });

        // Loop through and add previous day TVL to current day TVL
        graphData.forEach(function (plot, index) {
            if (index > 0) {
                plot.value = (plot.value || 0) + (graphData[index - 1].value || 0);
            }
        });
        return graphData.sort((a, b) => new Date(a.xaxis).valueOf() - new Date(b.xaxis).valueOf());
    }
};

export function useSubgraphTrancheData(trancheId: number): ISubgraphTrancheData {
    const network = getNetworkName();

    const queryTrancheData = useQuery({
        queryKey: ['tranche-data', Number(trancheId), network],
        queryFn: () => getSubgraphTrancheData(trancheId),
        enabled: !!trancheId,
    });

    const queryTrancheChart = useQuery({
        queryKey: ['tranche-chart', Number(trancheId), network],
        queryFn: () => getSubgraphTrancheChart(trancheId),
        enabled: !!trancheId,
    });

    const findAssetInMarketsData = (asset: string) => {
        if (queryTrancheData.isLoading || !queryTrancheData.data?.assetsData) return undefined;
        if (asset === 'ETH') {
            console.warn('Trying to get asset data for ETH, returning undefined');
            return undefined;
        }
        return (queryTrancheData.data?.assetsData as any)[asset];
    };

    return {
        queryTrancheData,
        findAssetInMarketsData,
        queryTrancheChart,
    };
}

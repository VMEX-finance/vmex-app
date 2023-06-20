import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { IGraphUserDataProps, ISubgraphUserData, IGraphTrancheDataProps } from './types';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { BigNumber, ethers } from 'ethers';
import { getAllAssetPrices } from '../prices';
import { nativeAmountToUSD, apolloClient } from '../../utils';
import { processTrancheData } from './getTrancheData';

type IncrementalChangeItem = {
    timestamp: number;
    usdValueDelta: number;
};

type ATokenBalanceItem = {
    index: BigNumber;
    scaledATokenBalance: BigNumber;
    timestamp: number;
};

type VariableTokenBalanceItem = {
    index: BigNumber;
    scaledVariableDebt: BigNumber;
    timestamp: number;
};

export const getUserAdminTrancheData = async (admin: string): Promise<IGraphTrancheDataProps[]> => {
    admin = admin.toLowerCase();
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryTrancheAdmin($admin: String!) {
                user(id: $admin) {
                    myTranches {
                        id
                        name
                        treasury
                        isUsingWhitelist
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
                        depositHistory(orderBy: timestamp, orderDirection: asc) {
                            user {
                                id
                            }
                        }
                        borrowHistory(orderBy: timestamp, orderDirection: asc) {
                            user {
                                id
                            }
                        }
                    }
                }
            }
        `,
        variables: { admin },
    });

    if (error) return [];
    else {
        if (data.user) {
            const dat = data.user.myTranches;

            const processedTrancheData = await Promise.all(
                dat.map((el: any) => processTrancheData(el)),
            );

            return processedTrancheData;
        }

        return [];
    }
};

const calculateInterestProfit = (
    prevATokenBalanceItem: ATokenBalanceItem,
    aTokenBalanceItem: ATokenBalanceItem,
    decimals: number,
    assetUSDPrice: BigNumber,
): number => {
    const incrementalInterestProfit = BigNumber.from(aTokenBalanceItem.index)
        .sub(BigNumber.from(prevATokenBalanceItem.index))
        .mul(BigNumber.from(prevATokenBalanceItem.scaledATokenBalance))
        .div(ethers.utils.parseUnits('1', 27)); // index is in ray, which has 27 decimals
    return nativeAmountToUSD(incrementalInterestProfit, decimals, assetUSDPrice);
};

const calculateInterestLoss = (
    prevVariableTokenBalanceItem: VariableTokenBalanceItem,
    variableTokenBalanceItem: VariableTokenBalanceItem,
    decimals: number,
    assetUSDPrice: BigNumber,
): number => {
    const incrementalInterestLoss = BigNumber.from(variableTokenBalanceItem.index)
        .sub(BigNumber.from(prevVariableTokenBalanceItem.index))
        .mul(BigNumber.from(prevVariableTokenBalanceItem.scaledVariableDebt))
        .div(ethers.utils.parseUnits('1', 27));
    return nativeAmountToUSD(incrementalInterestLoss, decimals, assetUSDPrice);
};

const addAllIncrementalProfits = (
    reserve: any,
    allIncrementalChanges: IncrementalChangeItem[],
    decimals: number,
    assetUSDPrice: BigNumber,
) => {
    if (reserve.aTokenBalanceHistory.length == 0) return;

    // calculate all incremental changes up to the last event
    reserve.aTokenBalanceHistory.map((aTokenBalanceItem: ATokenBalanceItem, idx: number) => {
        if (idx == 0) return; // skip first index
        const usdInterestDelta = calculateInterestProfit(
            reserve.aTokenBalanceHistory[idx - 1],
            aTokenBalanceItem,
            decimals,
            assetUSDPrice,
        );
        allIncrementalChanges.push({
            timestamp: aTokenBalanceItem.timestamp,
            usdValueDelta: usdInterestDelta,
        });
    });
    // calculate interest earned from last event until now

    const nowATokenBalanceItem: ATokenBalanceItem = {
        index: reserve.reserve.liquidityIndex,
        timestamp: Date.now() / 1000,
        scaledATokenBalance: BigNumber.from(0), // this value is not used
    };
    const usdInterestDelta = calculateInterestProfit(
        reserve.aTokenBalanceHistory[reserve.aTokenBalanceHistory.length - 1],
        nowATokenBalanceItem,
        decimals,
        assetUSDPrice,
    );
    allIncrementalChanges.push({
        timestamp: nowATokenBalanceItem.timestamp,
        usdValueDelta: usdInterestDelta,
    });
};

const addAllIncrementalLosses = (
    reserve: any,
    allIncrementalChanges: IncrementalChangeItem[],
    decimals: number,
    assetUSDPrice: BigNumber,
) => {
    if (reserve.variableTokenBalanceHistory.length == 0) return;

    // calculate all incremental changes up to the last event
    reserve.variableTokenBalanceHistory.map(
        (variableTokenBalanceItem: VariableTokenBalanceItem, idx: number) => {
            if (idx == 0) return; // skip first index
            const usdInterestDelta =
                calculateInterestLoss(
                    reserve.variableTokenBalanceHistory[idx - 1],
                    variableTokenBalanceItem,
                    decimals,
                    assetUSDPrice,
                ) * -1;

            allIncrementalChanges.push({
                timestamp: variableTokenBalanceItem.timestamp,
                usdValueDelta: usdInterestDelta,
            });
        },
    );
    // calculate interest loss from last event until now

    const nowDebtTokenBalanceItem: VariableTokenBalanceItem = {
        index: reserve.reserve.variableBorrowIndex,
        timestamp: Date.now() / 1000,
        scaledVariableDebt: BigNumber.from(0), // this value is not used
    };
    const usdInterestDelta =
        calculateInterestLoss(
            reserve.variableTokenBalanceHistory[reserve.variableTokenBalanceHistory.length - 1],
            nowDebtTokenBalanceItem,
            decimals,
            assetUSDPrice,
        ) * -1;
    allIncrementalChanges.push({
        timestamp: nowDebtTokenBalanceItem.timestamp,
        usdValueDelta: usdInterestDelta,
    });
};

export const getSubgraphUserChart = async (
    address: string,
): Promise<ILineChartDataPointProps[]> => {
    if (!address) return [];
    address = address.toLowerCase();
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryUserChart($address: String!) {
                user(id: $address) {
                    id
                    reserves {
                        reserve {
                            assetData {
                                underlyingAssetName
                            }
                            decimals
                            liquidityIndex
                            variableBorrowIndex
                        }
                        aTokenBalanceHistory(orderBy: timestamp, orderDirection: asc) {
                            scaledATokenBalance
                            index
                            timestamp
                        }
                        variableTokenBalanceHistory(orderBy: timestamp, orderDirection: asc) {
                            scaledVariableDebt
                            index
                            timestamp
                        }
                    }
                }
            }
        `,
        variables: { address },
    });

    if (error || !data.user) return [];

    let allReserves = data.user.reserves;
    let graphData: ILineChartDataPointProps[] = [];
    const prices = await getAllAssetPrices();

    const allIncrementalChanges: IncrementalChangeItem[] = [];
    let earliestDeposit = Number.MAX_SAFE_INTEGER;

    allReserves.map((reserve: any) => {
        const asset = reserve.reserve.assetData.underlyingAssetName.toUpperCase();
        const decimals = reserve.reserve.decimals;
        if (!(prices as any)[asset]) {
            console.log(
                'MISSING ORACLE PRICE FOR',
                asset,
                'skipping asset in any usd calculations',
            );
            return;
        }
        const assetUSDPrice = (prices as any)[asset].usdPrice;

        // PROFITS
        addAllIncrementalProfits(reserve, allIncrementalChanges, decimals, assetUSDPrice);
        if (reserve.aTokenBalanceHistory.length) {
            earliestDeposit = Math.min(earliestDeposit, reserve.aTokenBalanceHistory[0].timestamp);
        }

        // LOSSES
        addAllIncrementalLosses(reserve, allIncrementalChanges, decimals, assetUSDPrice);
    });

    allIncrementalChanges.sort(
        (a: IncrementalChangeItem, b: IncrementalChangeItem) => a.timestamp - b.timestamp,
    );

    // add a datapoint for starting at zero
    graphData.push({
        xaxis: new Date(earliestDeposit * 1000).toLocaleString(),
        value: 0,
    });

    const mergedData: IncrementalChangeItem[] = [];
    let tempAccrued = 0;
    allIncrementalChanges.forEach((el, idx) => {
        tempAccrued += el.usdValueDelta;
        console.log(el, idx, allIncrementalChanges.length - 1);
        if (
            idx === allIncrementalChanges.length - 1 ||
            allIncrementalChanges[idx + 1].timestamp - el.timestamp >= 60
        ) {
            console.log('MERGING');
            // only push to the merged data when the difference in timestamp is greater than a minute
            // or if we are at the last element in the array
            mergedData.push({
                timestamp: el.timestamp,
                usdValueDelta: tempAccrued,
            });
            tempAccrued = 0;
        }
    });

    let cumulativeValue = 0;
    mergedData.map((el, idx) => {
        cumulativeValue += mergedData[idx].usdValueDelta;
        graphData.push({
            xaxis: new Date(el.timestamp * 1000).toLocaleString(),
            value: cumulativeValue,
        });
    });

    return graphData;
};

export const getSubgraphUserData = async (address: string): Promise<IGraphUserDataProps> => {
    if (!address) return {};
    address = address.toLowerCase();
    const { data, error } = await apolloClient.query({
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
        return data;
    }
};

export function useSubgraphUserData(address?: string): ISubgraphUserData {
    const queryUserPnlChart = useQuery({
        queryKey: ['user-pnl-chart'],
        queryFn: () => getSubgraphUserChart(address || ''),
        refetchInterval: 1 * 60 * 1000, // Refetch every minute
        enabled: !!address,
    });

    const queryUserData = useQuery({
        queryKey: ['user-data'],
        queryFn: () => getSubgraphUserData(address || ''),
        enabled: !!address,
    });

    const queryTrancheAdminData = useQuery({
        queryKey: ['tranche-admin-data'],
        queryFn: () => getUserAdminTrancheData(address || ''),
    });

    return {
        queryUserPnlChart,
        queryUserData,
        queryTrancheAdminData,
    };
}

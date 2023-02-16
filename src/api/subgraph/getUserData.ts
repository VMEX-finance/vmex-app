import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { IGraphUserDataProps, ISubgraphUserData, IGraphTrancheDataProps } from './types';
import { ILineChartDataPointProps } from '@ui/components/charts';
import { BigNumber } from 'ethers';
import { getAllAssetPrices } from '../prices';
import { nativeAmountToUSD, apolloClient } from '../../utils';
import { processTrancheData } from './getTrancheData';

type BalanceHistoryItem = {
    timestamp: number;
    aTokenBalance: string;
    debtTokenBalance: string;
    reserveSymbol: string;
    reserveDecimals: number;
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

export const getSubgraphUserChart = async (
    address: string,
): Promise<ILineChartDataPointProps[]> => {
    if (!address) return [];
    address = address.toLowerCase();
    const { data, error } = await apolloClient.query({
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

            const value = nativeAmountToUSD(valueNative, pnlItem.reserveDecimals, assetUSDPrice);

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
        return graphData;
    }
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

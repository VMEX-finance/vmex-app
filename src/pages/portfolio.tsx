import React from 'react';
import { GridView } from '@/ui/templates';
import { Base } from '@/ui/base';
import { PortfolioStatsCard, UserPerformanceCard } from '@/ui/features';
import { YourPositionsTable, YourRewardsTable, YourTransactionsTable } from '@/ui/tables';
import { Card, WalletButton } from '@/ui/components';
import { useUserData, useUserRewards, useUserTranchesData } from '@/api';
import { useAccount } from 'wagmi';
import {
    addDollarAmounts,
    bigNumberToUnformattedString,
    averageOfArr,
    numberFormatter,
    isChainUnsupported,
} from '@/utils';
import { useSubgraphUserData } from '@/api';
import { useAnalyticsEventTracker } from '@/config';

const Portfolio: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Portfolio');
    const { address } = useAccount();
    const { queryUserActivity } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address);
    const { queryUserTranchesData } = useUserTranchesData(address);
    const { queryUserRewards } = useUserRewards(address);

    const calculateNetworth = () => {
        let sum = 0;
        sum =
            (addDollarAmounts(
                queryUserActivity.data?.supplies.map((el) => el.amount),
                false,
            ) as number) -
            (addDollarAmounts(
                queryUserActivity.data?.borrows.map((el) => el.amount),
                false,
            ) as number);
        return `$${sum ? sum.toFixed(2) : '0.00'}`;
    };

    const caculateAvgHealth = () => {
        if (queryUserTranchesData.isLoading || !queryUserTranchesData.data) return '0';
        else {
            const allHealths = queryUserTranchesData.data.map((tranche) =>
                parseFloat(tranche.healthFactor),
            );
            return averageOfArr(allHealths).toString();
        }
    };

    // UNCOMMENT TO HAVE HEALTH FACTORS
    // const suppliesWithHealth = () => {
    //     if (queryUserActivity.isLoading || !queryUserActivity.data) return [];
    //     else {
    //         if (!queryUserTranchesData.data) {
    //             return queryUserActivity.data?.supplies;
    //         } else {
    //             return queryUserActivity.data?.supplies.map((supply) => {
    //                 const foundHealth = queryUserTranchesData.data.find(
    //                     ({ trancheId }) => trancheId === supply.trancheId,
    //                 );
    //                 return {
    //                     ...supply,
    //                     healthFactor: foundHealth ? parseFloat(foundHealth.healthFactor) : 0,
    //                 };
    //             });
    //         }
    //     }
    // };

    // const borrowsWithHealth = () => {
    //     if (queryUserActivity.isLoading || !queryUserActivity.data) return [];
    //     else {
    //         if (!queryUserTranchesData.data) {
    //             return queryUserActivity.data?.borrows;
    //         } else {
    //             return queryUserActivity.data?.borrows.map((borrow) => {
    //                 const foundHealth = queryUserTranchesData.data.find(
    //                     ({ trancheId }) => trancheId === borrow.trancheId,
    //                 );
    //                 return {
    //                     ...borrow,
    //                     healthFactor: foundHealth ? parseFloat(foundHealth.healthFactor) : 0,
    //                 };
    //             });
    //         }
    //     }
    // };

    return (
        <Base title="Portfolio">
            {address && !isChainUnsupported() ? (
                <GridView type="fixed">
                    <div className="col-span-3 2xl:col-span-2 flex flex-col gap-3">
                        <PortfolioStatsCard
                            isLoading={queryUserActivity.isLoading}
                            networth={calculateNetworth()}
                            supplied={addDollarAmounts(
                                queryUserActivity.data?.supplies.map((el) => el.amount),
                            )}
                            borrowed={addDollarAmounts(
                                queryUserActivity.data?.borrows.map((el) => el.amount),
                            )}
                            avgHealth={caculateAvgHealth()}
                            healthLoading={queryUserTranchesData.isLoading}
                            avgApy={queryUserActivity.data?.avgApy.toString()}
                        />
                        <div className="flex flex-col lg:flex-row lg:grow gap-3">
                            <YourPositionsTable
                                type="supplies"
                                data={queryUserActivity.data?.supplies || []}
                                isLoading={queryUserActivity.isLoading}
                            />
                            <YourPositionsTable
                                type="borrows"
                                data={queryUserActivity.data?.borrows || []}
                                isLoading={queryUserActivity.isLoading}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 col-span-3 2xl:col-span-1">
                        <UserPerformanceCard
                            isLoading={queryUserActivity.isLoading || queryUserPnlChart.isLoading}
                            loanedAssets={queryUserActivity.data?.supplies?.map((el) => ({
                                asset: el.asset,
                                amount: numberFormatter.format(
                                    parseFloat(
                                        bigNumberToUnformattedString(el.amountNative, el.asset),
                                    ),
                                ),
                            }))}
                            tranches={queryUserActivity.data?.tranchesInteractedWith}
                            profitLossChart={queryUserPnlChart.data || []}
                            cardClass="h-full"
                        />
                    </div>
                    <div className="gap-3 col-span-3 flex flex-col lg:flex-row">
                        <YourRewardsTable
                            data={queryUserRewards.data || []}
                            isLoading={queryUserRewards.isLoading}
                            address={address}
                        />
                        <Card title="Your Transactions" titleClass="text-lg mb-2">
                            <YourTransactionsTable />
                        </Card>
                    </div>
                </GridView>
            ) : (
                <div className="mt-10 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg dark:text-neutral-200">
                            {isChainUnsupported()
                                ? 'Please switch networks'
                                : 'Please connect your wallet'}
                        </span>
                    </div>
                    <WalletButton type="accent" className="!w-fit" />
                </div>
            )}
        </Base>
    );
};
export default Portfolio;

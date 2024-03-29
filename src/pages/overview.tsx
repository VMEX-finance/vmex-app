import React from 'react';
import { Base } from '@/ui/base';
import { ProtocolStatsCard, UserPerformanceCard } from '@/ui/features';
import { Carousel } from '@/ui/components';
import {
    useLoopData,
    useSubgraphAllMarketsData,
    useSubgraphProtocolData,
    useSubgraphUserData,
    useUserData,
} from '@/api';
import { useAnalyticsEventTracker } from '@/config';
import { useAccount, useNetwork } from 'wagmi';
import { bigNumberToUnformattedString, isChainUnsupported, numberFormatter } from '@/utils';
import { YourPositionsTable } from '@/ui/tables';
import { GridView } from '@/ui/templates';
import { useGlobalContext } from '@/store';

const Overview: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Overview');
    const { address, isConnected } = useAccount();
    const { queryProtocolTVLChart, queryProtocolData } = useSubgraphProtocolData();
    const { queryUserActivity } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    return (
        <Base title="overview">
            <ProtocolStatsCard
                tvl={queryProtocolData.data?.tvl}
                tvlChart={queryProtocolTVLChart}
                reserve={queryProtocolData.data?.reserve}
                lenders={queryProtocolData.data?.uniqueLenders}
                borrowers={queryProtocolData.data?.uniqueBorrowers}
                markets={queryProtocolData.data?.markets}
                totalBorrowed={queryProtocolData.data?.totalBorrowed}
                totalSupplied={queryProtocolData.data?.totalSupplied}
                topBorrowedAssets={queryProtocolData.data?.topBorrowedAssets}
                topSuppliedAssets={queryProtocolData.data?.topSuppliedAssets}
                topTranches={queryProtocolData.data?.topTranches}
                isLoading={queryProtocolData.isLoading || queryProtocolData.isRefetching}
            />

            <Carousel
                type="strategies"
                items={queryAllMarketsData.data?.sort(
                    (a, b) => Number(b.supplyApy) - Number(a.supplyApy),
                )}
            />

            {isConnected && !isChainUnsupported() ? (
                <GridView type="fixed" cols="2xl:grid-cols-2" className="mt-8">
                    {/* TODO: Graph just doesn't make sense */}
                    {/* <UserPerformanceCard
                        isLoading={queryUserActivity.isLoading || queryUserPnlChart.isLoading}
                        loanedAssets={queryUserActivity.data?.supplies?.map((el: any) => ({
                            asset: el.asset,
                            amount: numberFormatter.format(
                                parseFloat(bigNumberToUnformattedString(el.amountNative, el.asset)),
                            ),
                        }))}
                        tranches={queryUserActivity.data?.tranchesInteractedWith}
                        profitLossChart={queryUserPnlChart.data || []}
                    /> */}
                    <div className="flex flex-col gap-3 lg:flex-row 2xl:col-span-2">
                        <YourPositionsTable
                            type="supplies"
                            data={queryUserActivity.data?.supplies}
                            isLoading={queryUserActivity.isLoading}
                        />
                        <YourPositionsTable
                            type="borrows"
                            data={queryUserActivity.data?.borrows}
                            isLoading={queryUserActivity.isLoading}
                        />
                    </div>
                </GridView>
            ) : (
                <></>
            )}
        </Base>
    );
};
export default Overview;

import React from 'react';
import { Base } from '@/ui/base';
import { ProtocolStatsCard, UserPerformanceCard } from '@/ui/features';
import { Carousel, WalletButton } from '@/ui/components';
import {
    useLoopData,
    useSubgraphAllMarketsData,
    useSubgraphProtocolData,
    useSubgraphUserData,
    useUserData,
} from '@/api';
import { useAnalyticsEventTracker } from '@/config';
import { useAccount, useNetwork } from 'wagmi';
import { NETWORKS, bigNumberToUnformattedString, numberFormatter } from '@/utils';
import { isAddress } from 'ethers/lib/utils.js';
import { YourPositionsTable } from '@/ui/tables';
import { GridView } from '@/ui/templates';

const Overview: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Overview');
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { queryProtocolTVLChart, queryProtocolData } = useSubgraphProtocolData();
    const { queryUserActivity, queryUserWallet } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();
    const { queryUserLooping } = useLoopData();

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
                isLoading={queryProtocolData.isLoading}
            />

            <Carousel
                type="strategies"
                items={queryAllMarketsData.data?.sort(
                    (a, b) => Number(b.supplyApy) - Number(a.supplyApy),
                )}
            />

            {isConnected && !chain?.unsupported ? (
                <GridView type="fixed" className="mt-8">
                    <UserPerformanceCard
                        isLoading={queryUserActivity.isLoading || queryUserPnlChart.isLoading}
                        loanedAssets={queryUserActivity.data?.supplies?.map((el: any) => ({
                            asset: el.asset,
                            amount: numberFormatter.format(
                                parseFloat(bigNumberToUnformattedString(el.amountNative, el.asset)),
                            ),
                        }))}
                        tranches={queryUserActivity.data?.tranchesInteractedWith}
                        profitLossChart={queryUserPnlChart.data || []}
                    />
                    <div className="flex flex-col gap-4 lg:flex-row 2xl:col-span-2">
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

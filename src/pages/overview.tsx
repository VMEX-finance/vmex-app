import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolStatsCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { useAccount, useNetwork } from 'wagmi';
import { numberFormatter } from '../utils/helpers';
import { bigNumberToUnformattedString } from '../utils/sdk-helpers';
import { useSubgraphProtocolData, useSubgraphUserData, useUserData } from '../api';
import useAnalyticsEventTracker from '../utils/google-analytics';

const Overview: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Overview');
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { queryProtocolTVLChart, queryProtocolData } = useSubgraphProtocolData();
    const { queryUserActivity } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address);

    return (
        <AppTemplate title="overview">
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
            {isConnected && !chain?.unsupported ? (
                <GridView type="fixed">
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
                    <div className="flex flex-col gap-4 xl:gap-5 lg:flex-row 2xl:col-span-2">
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
                <div className="mt-10 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg dark:text-neutral-200">
                            Please connect your wallet.
                        </span>
                    </div>
                    <WalletButton primary className="!w-fit" />
                </div>
            )}
        </AppTemplate>
    );
};
export default Overview;

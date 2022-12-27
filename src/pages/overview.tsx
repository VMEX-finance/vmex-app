import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolStatsCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { useUserData, useSubgraphProtocolData, useSubgraphUserData } from '../api';
import { useAccount } from 'wagmi';
import { numberFormatter } from '../utils/helpers';
import { bigNumberToUnformattedString } from '../utils/sdk-helpers';

const Overview: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { queryProtocolData } = useSubgraphProtocolData();
    const { queryUserPerformance, queryUserActivity } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address || '');

    return (
        <AppTemplate title="overview">
            <ProtocolStatsCard
                tvl={queryProtocolData.data?.tvl}
                reserve={queryProtocolData.data?.reserve}
                lenders={queryProtocolData.data?.uniqueLenders.length}
                borrowers={queryProtocolData.data?.uniqueBorrowers.length}
                markets={queryProtocolData.data?.markets}
                totalBorrowed={queryProtocolData.data?.totalBorrowed}
                totalSupplied={queryProtocolData.data?.totalSupplied}
                topBorrowedAssets={queryProtocolData.data?.topBorrowedAssets}
                topSuppliedAssets={queryProtocolData.data?.topSuppliedAssets}
                topTranches={queryProtocolData.data?.topTranches}
                isLoading={queryProtocolData.isLoading}
            />
            {isConnected ? (
                <GridView type="fixed">
                    <UserPerformanceCard
                        {...queryUserPerformance.data}
                        isLoading={queryUserPerformance.isLoading || queryUserActivity.isLoading}
                        loanedAssets={queryUserActivity.data?.supplies?.map((el) => ({
                            asset: el.asset,
                            amount: numberFormatter.format(
                                parseFloat(bigNumberToUnformattedString(el.amountNative, el.asset)),
                            ),
                        }))}
                        tranches={queryUserActivity.data?.tranchesInteractedWith}
                        profitLossChart={queryUserPnlChart.data || []}
                    />
                    <div className="flex flex-col gap-4 xl:gap-8 lg:flex-row 2xl:col-span-2">
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
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">Please connect your wallet.</span>
                    </div>
                    <WalletButton primary className="w-fit" />
                </div>
            )}
        </AppTemplate>
    );
};
export default Overview;

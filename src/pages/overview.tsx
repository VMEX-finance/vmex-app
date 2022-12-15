import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolStatsCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { useProtocolData } from '../api/protocol';
import { useUserData, useSubgraphProtocolData } from '../api';
import { useAccount } from 'wagmi';
import { numberFormatter } from '../utils/helpers';
import { bigNumberToUnformattedString } from '../utils/sdk-helpers';

const Overview: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { queryProtocolOverview } = useProtocolData();
    const { queryProtocolData } = useSubgraphProtocolData();
    const { queryUserPerformance, queryUserActivity } = useUserData(address);

    return (
        <AppTemplate title="overview">
            <ProtocolStatsCard
                {...queryProtocolOverview.data}
                isLoading={queryProtocolOverview.isLoading}
                lenders={queryProtocolData.data?.uniqueLenders.length}
                borrowers={queryProtocolData.data?.uniqueBorrowers.length}
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

import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolStatsCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { useProtocolData } from '../api/protocol';
import { useUserData } from '../api/user';
import { useAccount } from 'wagmi';
const Overview: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { queryProtocolOverview } = useProtocolData();
    const { queryUserPerformance, queryUserActivity } = useUserData(address);

    return (
        <AppTemplate title="overview">
            <ProtocolStatsCard
                {...queryProtocolOverview.data}
                isLoading={queryProtocolOverview.isLoading}
            />
            {isConnected ? (
                <GridView type="fixed">
                    <UserPerformanceCard
                        {...queryUserPerformance.data}
                        isLoading={queryUserPerformance.isLoading}
                    />
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
                </GridView>
            ) : (
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">Please connect your wallet.</span>
                    </div>
                    <WalletButton primary />
                </div>
            )}
        </AppTemplate>
    );
};
export default Overview;

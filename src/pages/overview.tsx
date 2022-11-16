import { useWalletState } from '../hooks/wallet';
import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolStatsCard } from '../ui/features/overview';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { MOCK_YOUR_BORROWS, MOCK_YOUR_SUPPLIES } from '../utils/mock-data';
import { useProtocolData } from '../hooks/protocol';
import { useUserData } from '../hooks/user';

const Overview: React.FC = () => {
    const { address } = useWalletState();
    const { queryProtocolOverview } = useProtocolData();
    const { queryUserPerformance } = useUserData();

    return (
        <AppTemplate title="overview">
            <ProtocolStatsCard
                {...queryProtocolOverview.data}
                isLoading={queryProtocolOverview.isLoading}
            />
            {address ? (
                <GridView type="fixed">
                    <UserPerformanceCard {...queryUserPerformance.data} />
                    <YourPositionsTable type="supplies" data={MOCK_YOUR_SUPPLIES} />
                    <YourPositionsTable type="borrows" data={MOCK_YOUR_BORROWS} />
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

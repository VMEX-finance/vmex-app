import { useMarketOverview } from '../hooks/markets';
import { useWalletState } from '../hooks/wallet';
import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolTVLDataCard } from '../ui/features/overview';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { MOCK_YOUR_BORROWS, MOCK_YOUR_SUPPLIES } from '../utils/mock-data';

const Overview: React.FC = () => {
    const { TVLDataProps } = useMarketOverview();
    const { address } = useWalletState();

    return (
        <AppTemplate title="overview">
            <ProtocolTVLDataCard {...TVLDataProps()} />
            {address ? (
                <GridView type="fixed">
                    <UserPerformanceCard />
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

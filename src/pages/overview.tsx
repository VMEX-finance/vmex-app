import { useMarketOverview } from '../hooks/markets';
import { useWalletState } from '../hooks/wallet';
import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { LendingPerformanceCard, TVLDataCard } from '../ui/features/overview';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';

const Overview: React.FC = () => {
    const { TVLDataProps } = useMarketOverview();
    const { address } = useWalletState();
    console.log(address);

    return (
        <AppTemplate title="overview">
            <TVLDataCard {...TVLDataProps()} />
            {address ? (
                <GridView type="fixed">
                    <LendingPerformanceCard />
                    <YourPositionsTable type="supplies" />
                    <YourPositionsTable type="borrows" />
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

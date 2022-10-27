import { useMarketOverview } from '../hooks/markets';
import { useWalletState } from '../hooks/wallet';
import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import {
    LendingPerformanceCard,
    AssetExposureCard,
    TVLDataCard,
    YourPositions,
} from '../ui/features/overview';

const Overview: React.FC = () => {
    const { TVLDataProps } = useMarketOverview();
    const { address } = useWalletState();
    console.log(address);

    return (
        <AppTemplate title="overview">
            <TVLDataCard {...TVLDataProps()} />
            {address && (
                <GridView type="fixed">
                    <LendingPerformanceCard />
                    <YourPositions type="supplies" />
                    <YourPositions type="borrows" />
                </GridView>
            )}
        </AppTemplate>
    );
};
export default Overview;

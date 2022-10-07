import { useMarketOverview } from '../hooks/markets';
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

    return (
        <AppTemplate title="lending">
            <TVLDataCard {...TVLDataProps()} />
            <GridView type="fixed">
                <LendingPerformanceCard />
                <YourPositions type="supplies" />
                <YourPositions type="borrows" />
            </GridView>
        </AppTemplate>
    );
};
export default Overview;

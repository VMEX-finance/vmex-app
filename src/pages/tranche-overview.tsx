import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard } from '../ui/features/tranche/TrancheTvlDataCard';
import { useTrancheOverview } from '../hooks/markets';
import { Card } from '../ui/components/cards';
import { TrancheTable } from '../ui/components/tables/TrancheOverviewTable';
import { _mockMarketsData } from '../models/tranche-supply';
import { _mockBorrowData } from '../models/tranche-borrow';
const TrancheOverview: React.FC = () => {
    const { TVLDataProps } = useTrancheOverview();

    return (
        <AppTemplate title="Tranche">
            <TrancheTVLDataCard {...TVLDataProps()} />
            <GridView>
                <Card>
                    <TrancheTable data={_mockMarketsData} primary />
                </Card>
                <Card>
                    <TrancheTable data={_mockBorrowData} />
                </Card>
            </GridView>
        </AppTemplate>
    );
};
export default TrancheOverview;

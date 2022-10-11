import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard } from '../ui/features/tranche/TrancheTvlDataCard';
import { useTrancheOverview } from '../hooks/markets';
import { Card } from '../ui/components/cards';
import { TrancheTable } from '../ui/components/tables/TrancheOverviewTable';
import { _mockMarketsData } from '../models/tranche-supply';
import { _mockBorrowData } from '../models/tranche-borrow';
const TrancheDetails: React.FC = () => {
    const { TVLDataProps } = useTrancheOverview();

    return (
        <AppTemplate title="pools" description="Tranche Name" back="yes">
            <TrancheTVLDataCard {...TVLDataProps()} />
            <GridView>
                <Card></Card>
                <Card></Card>
            </GridView>
        </AppTemplate>
    );
};
export default TrancheDetails;

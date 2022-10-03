import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard } from '../ui/features/overview/TrancheTvlDataCard';
import { useTrancheOverview } from '../hooks/markets';

const TrancheOverview: React.FC = () => {
    const { TVLDataProps } = useTrancheOverview();

    return <AppTemplate title="Tranche">
        <TrancheTVLDataCard {...TVLDataProps()}/>
        <GridView>
        </GridView>
    </AppTemplate>;
};
export default TrancheOverview;
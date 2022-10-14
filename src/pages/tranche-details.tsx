import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard } from '../ui/features/tranche/TrancheTvlDataCard';
import { useTrancheOverview } from '../hooks/markets';
import { Card } from '../ui/components/cards';
import { TrancheInfo } from '../ui/components/tables/TrancheInfo';
import { _mockMarketsData } from '../models/tranche-supply';
import { _mockBorrowData } from '../models/tranche-borrow';
import { TrancheStatisticsCard } from '../ui/features/overview';
import { TrancheTable } from '../ui/components/tables/TrancheOverviewTable';
import { useLocation } from 'react-router-dom';

const TrancheDetails: React.FC = () => {
    const location = useLocation();
    const { TVLDataProps } = useTrancheOverview();
    const [view, setView] = useState('tranche-overview');
    const [tranche, setTranche] = useState({});

    useEffect(() => {
        if (location.state.view === 'overview') setView('tranche-overview');
        if (location.state.view === 'details') setView('tranche-details');
        if (location.state.tranche) setTranche(location.state.tranche);
        console.log(tranche);
    }, [location, tranche]);

    return (
        <AppTemplate title="Tranche" description="Tranche Name" view={view}>
            <TrancheTVLDataCard {...TVLDataProps()} />
            <GridView>
                {view.includes('details') ? (
                    <>
                        <Card>
                            <TrancheInfo data={_mockMarketsData} />
                        </Card>
                        <TrancheStatisticsCard />
                    </>
                ) : (
                    <>
                        <Card>
                            <TrancheTable data={_mockMarketsData} primary />
                        </Card>
                        <Card>
                            <TrancheTable data={_mockBorrowData} />
                        </Card>
                    </>
                )}
            </GridView>
        </AppTemplate>
    );
};
export default TrancheDetails;

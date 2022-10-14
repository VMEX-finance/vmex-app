import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard } from '../ui/features/tranche/TrancheTvlDataCard'; // Must be exported out of 'index.ts'
import { useTrancheOverview } from '../hooks/markets';
import { Card } from '../ui/components/cards';
import { _mockMarketsData } from '../models/tranche-supply';
import { _mockBorrowData } from '../models/tranche-borrow';
import { TrancheStatisticsCard } from '../ui/features/overview';
import { TrancheTable, TrancheInfo } from '../ui/components/tables';
import { useLocation } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store/contexts';

const TrancheDetails: React.FC = () => {
    const location = useLocation();
    const { TVLDataProps } = useTrancheOverview();
    const { tranche } = useSelectedTrancheContext();
    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        if (location.state.view === 'overview') setView('tranche-overview');
        else if (location.state.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [location]);

    return (
        <AppTemplate
            title={tranche?.name || 'Tranche Name'}
            description="Tranche"
            view={view}
            setView={setView}
        >
            {/* TODO: Should not use TVL Data Props from the entire protocol? */}
            <TrancheTVLDataCard {...TVLDataProps()} />
            <GridView>
                {view.includes('details') ? (
                    <>
                        <Card>
                            <TrancheInfo tranche={tranche} />
                        </Card>
                        <TrancheStatisticsCard tranche={tranche} />
                    </>
                ) : (
                    <>
                        <Card>
                            {/* TODO: Replace tables "data" prop with tranche table data prop    */}
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

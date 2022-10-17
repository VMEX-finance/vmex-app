import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard } from '../ui/features/tranche/TrancheTvlDataCard'; // Must be exported out of 'index.ts'
import { useTrancheOverview } from '../hooks/markets';
import { Card } from '../ui/components/cards';
import { TrancheStatisticsCard } from '../ui/features/overview';
import { TrancheTable, TrancheInfo } from '../ui/components/tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store/contexts';
import { _mockAssetData } from '../models/available-liquidity-model';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { TVLDataProps } = useTrancheOverview();
    const { tranche } = useSelectedTrancheContext();
    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        // TODO: make this return to last page, not always tranches
        if (!tranche.name) navigate('/tranches');

        if (location.state.view === 'overview') setView('tranche-overview');
        else if (location.state.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [location, tranche.name]);

    return (
        <AppTemplate
            title={tranche?.name || 'Tranche Name'}
            description="Tranche"
            view={view}
            setView={setView}
        >
            {/* TODO: Should not use TVL Data Props from the entire protocol? */}
            <TrancheTVLDataCard {...TVLDataProps()} />
            {view.includes('details') ? (
                <GridView className="lg:grid-cols-[1fr_2fr]">
                    <Card>
                        <TrancheInfo tranche={tranche} />
                    </Card>
                    <TrancheStatisticsCard tranche={tranche} />
                </GridView>
            ) : (
                <GridView>
                    <Card>
                        <h3>Supply</h3>
                        {/* TODO: Replace tables "data" prop with tranche table data prop */}
                        <TrancheTable data={_mockAssetData.data} type="supply" />
                    </Card>
                    <Card>
                        <h3>Borrow</h3>
                        <TrancheTable data={_mockAssetData.data} type="borrow" />
                    </Card>
                </GridView>
            )}
        </AppTemplate>
    );
};
export default TrancheDetails;

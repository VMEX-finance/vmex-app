import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard, TrancheInfoCard } from '../ui/features/tranche';
import { Card } from '../ui/components/cards';
import { TrancheStatisticsCard } from '../ui/features/overview';
import { TrancheTable } from '../ui/components/tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store/contexts';
import { _mockAssetData } from '../models/available-liquidity-model';
import { _mockTranchesData } from '../utils/mock-data';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tranche, setTranche } = useSelectedTrancheContext();
    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        if (location.state?.view === 'overview') setView('tranche-overview');
        else if (location.state?.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [location]);

    useEffect(() => {
        if (!tranche.id) navigate('/tranches');
        const found = _mockTranchesData.find((el) => el.id === tranche.id);
        setTranche(found);
    }, [tranche, location]);

    return (
        <AppTemplate
            title={tranche?.name || 'Tranche Name'}
            description="Tranche"
            view={view}
            setView={setView}
        >
            {/* TODO: Configure this to include all necessary props */}
            <TrancheTVLDataCard
                assets={tranche.assets}
                tvl={tranche.tvl}
                grade={tranche.aggregateRating}
                supplied={tranche.supplyTotal}
                borrowed={tranche.borrowTotal}
            />
            {view.includes('details') ? (
                <GridView className="lg:grid-cols-[1fr_2fr]">
                    <TrancheInfoCard tranche={tranche} />
                    <TrancheStatisticsCard tranche={tranche} />
                </GridView>
            ) : (
                <GridView>
                    <Card>
                        <h3 className="text-2xl">Supply</h3>
                        {/* TODO: Replace tables "data" prop with tranche table data prop */}
                        <TrancheTable data={_mockAssetData.data} type="supply" />
                    </Card>
                    <Card>
                        <h3 className="text-2xl">Borrow</h3>
                        <TrancheTable data={_mockAssetData.data} type="borrow" />
                    </Card>
                </GridView>
            )}
        </AppTemplate>
    );
};
export default TrancheDetails;

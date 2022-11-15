import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard, TrancheInfoCard, TrancheStatisticsCard } from '../ui/features/tranche';
import { Card } from '../ui/components/cards';
import { TrancheTable } from '../ui/tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store/contexts';
import { MOCK_TRANCHES_DATA } from '../utils/mock-data';
import { useWalletState } from '../hooks/wallet';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = useWalletState();
    const { tranche, setTranche } = useSelectedTrancheContext();
    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        if (!address) setView('tranche-details');
        else if (location.state?.view === 'overview') setView('tranche-overview');
        else if (location.state?.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [location]);

    useEffect(() => {
        if (!tranche.id) navigate('/tranches');
        const found = MOCK_TRANCHES_DATA.find((el) => el.id === tranche.id);
        setTranche(found);
    }, [tranche, location]);

    return (
        <AppTemplate
            title={tranche?.name || 'Tranche Name'}
            description="Tranche"
            view={view}
            setView={setView}
        >
            <TrancheTVLDataCard
                assets={tranche.assets}
                grade={tranche.aggregateRating}
                tvl={tranche.tvl}
                tvlChange={tranche.tvlChange}
                supplied={tranche.supplyTotal}
                supplyChange={tranche.supplyChange}
                borrowed={tranche.borrowTotal}
                borrowChange={tranche.borrowChange}
            />
            {view.includes('details') ? (
                <>
                    <GridView className="lg:grid-cols-[1fr_2fr]">
                        <TrancheInfoCard tranche={tranche} />
                        <TrancheStatisticsCard tranche={tranche} />
                    </GridView>
                </>
            ) : (
                <GridView>
                    <Card>
                        <h3 className="text-2xl">Supply</h3>
                        {/* TODO: Replace tables "data" prop with tranche table data prop */}
                        <TrancheTable
                            data={
                                tranche.assets
                                    ? tranche.assets.map((el: string) => ({
                                          asset: el,
                                          canBeCollat: false,
                                          apy_perc: (Math.random() * 10).toFixed(2),
                                          amount: 0,
                                      }))
                                    : []
                            }
                            type="supply"
                        />
                    </Card>
                    <Card>
                        <h3 className="text-2xl">Borrow</h3>
                        <TrancheTable
                            data={
                                tranche.assets
                                    ? tranche.assets.map((el: string) => ({
                                          asset: el,
                                          liquidity: (Math.random() * 30).toFixed(1),
                                          apy_perc: (Math.random() * 10).toFixed(2),
                                          amount: 0,
                                      }))
                                    : []
                            }
                            type="borrow"
                        />
                    </Card>
                </GridView>
            )}
        </AppTemplate>
    );
};
export default TrancheDetails;

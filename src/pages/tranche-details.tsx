import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { TrancheTVLDataCard, TrancheInfoCard, TrancheStatisticsCard } from '../ui/features/tranche';
import { Card } from '../ui/components/cards';
import { TrancheTable } from '../ui/tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store/contexts';
import { MOCK_TRANCHES_DATA } from '../utils/mock-data';
import { useWalletState } from '../hooks/wallet';
import { useTrancheMarketsData, useTranchesData } from '../api/protocol';
import { IMarketsAsset } from '@models/markets';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address, signer } = useWalletState();
    const { tranche, setTranche } = useSelectedTrancheContext();
    const { queryTrancheMarkets } = useTrancheMarketsData(tranche.id);
    const { queryAllTranches } = useTranchesData();
    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        if (!address) setView('tranche-details');
        else if (location.state?.view === 'overview') setView('tranche-overview');
        else if (location.state?.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [location]);

    useEffect(() => {
        if (!tranche.id) navigate('/tranches');
        const found = queryAllTranches.data?.find((el) => el.id === tranche.id);
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
                                queryTrancheMarkets.data
                                    ? queryTrancheMarkets.data.map((el: IMarketsAsset) => ({
                                          asset: el.asset,
                                          canBeCollat: el.canBeCollateral,
                                          apy_perc: el.supplyApy,
                                          amount: el.yourAmount.toString(), //this needs to be gotten from user data fetching
                                          tranche: tranche.id,
                                          signer: signer,
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
                                queryTrancheMarkets.data
                                    ? queryTrancheMarkets.data
                                          .filter((el: IMarketsAsset) => el.canBeBorrowed)
                                          .map((el: IMarketsAsset) => ({
                                              asset: el.asset,
                                              liquidity: el.available,
                                              apy_perc: el.borrowApy,
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

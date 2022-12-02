import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import {
    TrancheTVLDataCard,
    TrancheInfoCard,
    TrancheStatisticsCard,
} from '../ui/features/tranche-details';
import { Card } from '../ui/components/cards';
import { TrancheTable } from '../ui/tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store/contexts';
import { useWalletState } from '../hooks/wallet';
import { useTrancheMarketsData, useTranchesData } from '../api/protocol';
import { IMarketsAsset } from '@models/markets';
// import { useUserData } from '../hooks/user';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address, signer } = useWalletState();
    const { tranche, setTranche } = useSelectedTrancheContext();
    const { queryTrancheMarkets } = useTrancheMarketsData(tranche.id);
    const { queryAllTranches } = useTranchesData();
    // const { queryUserPerformance, queryUserActivity, queryUserWallet } = useUserData(address);
    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        if (!address) setView('tranche-details');
        else if (location.state?.view === 'overview') setView('tranche-overview');
        else if (location.state?.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [address, location]);

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
                    <Card loading={queryTrancheMarkets.isLoading}>
                        <h3 className="text-2xl">Supply</h3>
                        <TrancheTable
                            data={
                                queryTrancheMarkets.data
                                    ? queryTrancheMarkets.data.map((el) => ({
                                          asset: el.asset,
                                          canBeCollat: el.canBeCollateral,
                                          apy_perc: el.supplyApy,
                                          tranche: tranche.id,
                                          signer: signer,
                                      }))
                                    : []
                            }
                            type="supply"
                        />
                    </Card>
                    <Card loading={queryTrancheMarkets.isLoading}>
                        <h3 className="text-2xl">Borrow</h3>
                        <TrancheTable
                            data={
                                queryTrancheMarkets.data
                                    ? queryTrancheMarkets.data
                                          .filter((el) => el.canBeBorrowed)
                                          .map((el) => ({
                                              asset: el.asset,
                                              liquidity: el.availableNative,
                                              apy_perc: el.borrowApy,
                                              tranche: tranche.id,
                                              signer: signer,
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

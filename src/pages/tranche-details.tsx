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
import { useAccount, useSigner } from 'wagmi';
import { useSubgraphTrancheData } from '../api';
import { percentFormatter } from '../utils/helpers';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { tranche, setTranche, asset } = useSelectedTrancheContext();
    const { queryTrancheData } = useSubgraphTrancheData(tranche.id || location.state?.trancheId);

    const [view, setView] = useState('tranche-overview');

    useEffect(() => {
        if (!address) setView('tranche-details');
        else if (location.state?.view === 'overview') setView('tranche-overview');
        else if (location.state?.view === 'details') setView('tranche-details');
        else setView('tranche-overview');
    }, [address, location]);

    useEffect(() => {
        if (queryTrancheData.data && tranche !== queryTrancheData.data)
            setTranche(queryTrancheData.data);
    }, [queryTrancheData.data, setTranche, tranche]);

    useEffect(() => {
        if (!tranche?.id && !location.state?.trancheId) navigate('/tranches');
    }, [navigate, tranche.id, location]);

    return (
        <AppTemplate
            title={tranche?.name || 'Tranche Name'}
            description="Tranche"
            view={view}
            setView={setView}
        >
            <TrancheTVLDataCard
                assets={queryTrancheData.data?.assets || tranche.assets}
                grade={tranche.aggregateRating}
                tvl={queryTrancheData.data?.tvl || tranche.tvl}
                tvlChange={tranche.tvlChange}
                supplied={queryTrancheData.data?.totalSupplied || tranche.supplyTotal}
                supplyChange={tranche.supplyChange}
                borrowed={queryTrancheData.data?.totalBorrowed || tranche.borrowTotal}
                borrowChange={tranche.borrowChange}
            />
            {view.includes('details') ? (
                <>
                    <GridView className="lg:grid-cols-[1fr_2fr]">
                        <TrancheInfoCard
                            tranche={queryTrancheData.data}
                            loading={queryTrancheData.isLoading}
                        />
                        <TrancheStatisticsCard
                            tranche={queryTrancheData.data}
                            trancheId={tranche.id}
                            loading={queryTrancheData.isLoading}
                            assetData={
                                queryTrancheData.data && queryTrancheData.data.assetsData && asset
                                    ? (queryTrancheData.data.assetsData as any)[asset]
                                    : {}
                            }
                        />
                    </GridView>
                </>
            ) : (
                <GridView>
                    <Card loading={queryTrancheData.isLoading}>
                        <h3 className="text-2xl">Supply</h3>
                        <TrancheTable
                            data={
                                queryTrancheData.data && queryTrancheData.data.assetsData
                                    ? Object.keys(queryTrancheData.data.assetsData).map(
                                          (asset) => ({
                                              asset: asset,
                                              canBeCollat: (
                                                  queryTrancheData.data.assetsData as any
                                              )[asset].collateral,
                                              apy: percentFormatter.format(
                                                  (queryTrancheData.data.assetsData as any)[asset]
                                                      .supplyRate,
                                              ),
                                              tranche: queryTrancheData.data?.name,
                                              trancheId: tranche.id,
                                              signer: signer,
                                          }),
                                      )
                                    : []
                            }
                            type="supply"
                        />
                    </Card>
                    <Card loading={queryTrancheData.isLoading}>
                        <h3 className="text-2xl">Borrow</h3>
                        <TrancheTable
                            data={
                                queryTrancheData.data && queryTrancheData.data.assetsData
                                    ? Object.keys(queryTrancheData.data.assetsData).map(
                                          (asset) => ({
                                              asset: asset,
                                              liquidity: (queryTrancheData.data.assetsData as any)[
                                                  asset
                                              ].liquidity,
                                              apy: percentFormatter.format(
                                                  (queryTrancheData.data.assetsData as any)[asset]
                                                      .borrowRate,
                                              ),
                                              tranche: queryTrancheData.data?.name,
                                              trancheId: tranche.id,
                                              signer: signer,
                                          }),
                                      )
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

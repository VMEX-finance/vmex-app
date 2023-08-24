import React, { useEffect, useState } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import {
    TrancheTVLDataCard,
    TrancheInfoCard,
    TrancheStatisticsCard,
} from '../ui/features/tranche-details';
import { Card, Legend } from '../ui/components';
import { TrancheTable } from '../ui/tables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../store';
import { useAccount, useSigner } from 'wagmi';
import { useSubgraphTrancheData, useUserTrancheData } from '../api';
import useAnalyticsEventTracker from '../utils/google-analytics';

const TrancheDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { tranche, setTranche, asset } = useSelectedTrancheContext();
    const { queryTrancheData } = useSubgraphTrancheData(location.state?.trancheId);
    const { queryUserTrancheData } = useUserTrancheData(address, location.state?.trancheId);
    const [view, setView] = useState('tranche-overview');
    const gaEventTracker = useAnalyticsEventTracker(
        `Tranche Details - ${tranche?.id || location.state?.trancheId}`,
    );

    useEffect(() => {
        if (!address) setView('tranche-details');
        else if (location.state?.view === 'overview') {
            setView('tranche-overview');
        } else if (location.state?.view === 'details') setView('tranche-details');
        else {
            setView('tranche-overview');
        }
    }, [address, location]);

    useEffect(() => {
        setTranche(queryTrancheData.data);
    }, [queryTrancheData.data, setTranche, tranche]);

    useEffect(() => {
        if (!tranche?.id && !location.state?.trancheId) {
            console.warn('Not set tranche and location');
            navigate('/tranches');
        }
    }, [navigate, tranche, location]);

    console.log(queryTrancheData.data, queryTrancheData.error);

    return (
        <AppTemplate
            title={tranche?.name}
            description="Tranche"
            view={view}
            setView={setView}
            titleLoading={queryTrancheData.isLoading}
        >
            <TrancheTVLDataCard
                assets={queryTrancheData.data?.assets || tranche?.assets}
                grade={tranche?.aggregateRating}
                tvl={queryTrancheData.data?.tvl || tranche?.tvl}
                tvlChange={tranche?.tvlChange}
                supplied={queryTrancheData.data?.totalSupplied || tranche?.supplyTotal}
                supplyChange={tranche?.supplyChange}
                borrowed={queryTrancheData.data?.totalBorrowed || tranche?.borrowTotal}
                borrowChange={tranche?.borrowChange}
                loading={queryTrancheData.isLoading}
                userData={queryUserTrancheData}
                avgApy={queryTrancheData.data?.avgApy || 0}
                collateral={queryTrancheData.data?.totalCollateral || tranche?.collateralTotal}
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
                            trancheId={tranche?.id}
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
                <GridView type="fixed" cols="grid-cols-1 lg:grid-cols-2">
                    <Card
                        loading={queryTrancheData.isLoading}
                        header={
                            <div className="flex justify-between items-center">
                                <h3 className={'text-2xl'}>Supply</h3>
                                <Legend
                                    items={[
                                        {
                                            name: 'Supplied',
                                            color: 'bg-brand-green-neon',
                                        },
                                        {
                                            name: 'Collateralized',
                                            color: 'bg-brand-blue',
                                        },
                                        {
                                            name: 'Rewards',
                                            color: 'bg-brand-purple',
                                        },
                                    ]}
                                />
                            </div>
                        }
                    >
                        <TrancheTable
                            data={
                                queryTrancheData.data && queryTrancheData.data.assetsData
                                    ? Object.keys(queryTrancheData.data.assetsData).map(
                                          (asset) => ({
                                              asset: asset,
                                              canBeCollat: (
                                                  queryTrancheData.data.assetsData as any
                                              )[asset].collateral,
                                              apy: (queryTrancheData.data.assetsData as any)[asset]
                                                  .supplyRate,
                                              tranche: queryTrancheData.data?.name,
                                              trancheId: tranche?.id,
                                              signer: signer,
                                          }),
                                      )
                                    : []
                            }
                            type="supply"
                        />
                    </Card>
                    <Card
                        loading={queryTrancheData.isLoading}
                        header={
                            <div className="flex justify-between items-center">
                                <h3 className={'text-2xl'}>Borrow</h3>
                                <Legend
                                    items={[
                                        {
                                            name: 'Borrowed',
                                            color: 'bg-brand-green-neon',
                                        },
                                    ]}
                                />
                            </div>
                        }
                    >
                        <TrancheTable
                            data={
                                queryTrancheData.data && queryTrancheData.data.assetsData
                                    ? Object.keys(queryTrancheData.data.assetsData)
                                          .filter((asset) => {
                                              if (
                                                  (queryTrancheData.data.assetsData as any)[asset]
                                                      .canBeBorrowed
                                              ) {
                                                  return true;
                                              }
                                              return false;
                                          })
                                          .map((asset) => ({
                                              asset: asset,
                                              liquidity: (queryTrancheData.data.assetsData as any)[
                                                  asset
                                              ].liquidity,
                                              apy: (queryTrancheData.data.assetsData as any)[asset]
                                                  .borrowRate,
                                              tranche: queryTrancheData.data?.name,
                                              trancheId: tranche?.id,
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

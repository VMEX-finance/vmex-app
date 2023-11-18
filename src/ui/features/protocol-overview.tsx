import React from 'react';
import { TopTranchesTable } from '../tables';
import { makeCompact } from '@/utils';
import { AssetBalance, TrancheData } from '@/api';
import {
    Loader,
    NumberDisplay,
    PillDisplay,
    Card,
    ILineChartDataPointProps,
} from '@/ui/components';
import { UseQueryResult } from '@tanstack/react-query';
import { useSelectedTrancheContext } from '@/store';
import { useNavigate } from 'react-router-dom';
import { ReAreaChart } from '@/ui/charts';

export interface IProtocolProps {
    isLoading?: boolean;
    tvl?: string;
    reserve?: string;
    lenders?: number;
    borrowers?: number;
    markets?: number;
    totalSupplied?: string;
    totalBorrowed?: string;
    topBorrowedAssets?: AssetBalance[];
    topSuppliedAssets?: AssetBalance[];
    topTranches?: TrancheData[];
    tvlChart?: UseQueryResult<ILineChartDataPointProps[], unknown>;
}

export const ProtocolStatsCard: React.FC<IProtocolProps> = ({
    tvl,
    reserve,
    lenders,
    borrowers,
    markets,
    totalBorrowed,
    totalSupplied,
    topBorrowedAssets,
    topSuppliedAssets,
    topTranches,
    isLoading,
    tvlChart,
}) => {
    const { setAsset } = useSelectedTrancheContext();
    const navigate = useNavigate();
    const renderTopAssetsList = (_arr: AssetBalance[] | undefined) => {
        if (!_arr) return [];
        else {
            const arr = _arr.filter(
                (el) => parseFloat(el.amount.includes('$') ? el.amount.slice(1) : el.amount) !== 0,
            );
            return arr.slice(0, 5);
        }
    };

    const handlePillClick = (asset: string, trancheId?: string, trancheName?: string) => {
        setAsset(asset);
        navigate(`/tranches/${trancheName?.replaceAll(' ', '-').toLowerCase()}`, {
            state: { trancheId, view: 'details' },
        });
    };

    return (
        <Card>
            <div className="flex flex-col lg:flex-row gap-2 md:gap-4 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-neutral-300 dark:divide-neutral-800">
                <div className="flex flex-col md:flex-row font-basefont gap-2 md:gap-4 2xl:gap-6">
                    <div className="flex flex-col justify-between min-w-[90%] lg:min-w-[300px]">
                        <NumberDisplay
                            size="xl"
                            label="Total Available"
                            value={tvl ? makeCompact(tvl, true) : '-'}
                            labelClass="text-2xl"
                            loading={isLoading}
                        />
                        {tvlChart?.isLoading ? (
                            <Loader variant="rounded" animation="wave" className="min-w-full">
                                <div className="h-[100px] w-full">
                                    <ReAreaChart data={tvlChart?.data || []} type="usd" />
                                </div>
                            </Loader>
                        ) : (
                            <div className="h-[100px] lg:h-full w-full">
                                <ReAreaChart data={tvlChart?.data || []} type="usd" />
                            </div>
                        )}
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <NumberDisplay
                            label={'Reserves:'}
                            value={reserve ? reserve : '-'}
                            loading={isLoading}
                        />
                        <NumberDisplay
                            color="text-brand-purple"
                            label={'Lenders:'}
                            value={lenders ? lenders : '-'}
                            loading={isLoading}
                        />
                        <NumberDisplay
                            color="text-brand-green"
                            label={'Borrowers:'}
                            value={borrowers ? borrowers : '-'}
                            loading={isLoading}
                        />
                        <NumberDisplay
                            label={'Markets:'}
                            value={markets ? markets : '-'}
                            loading={isLoading}
                        />
                    </div>
                </div>

                <div className="py-2 md:py-4 lg:py-0 lg:px-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-2 gap-y-4 w-full">
                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Market Size"
                            value={totalSupplied ? totalSupplied : '-'}
                            loading={isLoading}
                        />
                        <div className="flex flex-col gap-1">
                            <span>Top Supplied Assets</span>
                            <div className="flex flex-wrap gap-1">
                                {isLoading ? (
                                    <Loader variant="rounded" className="!rounded-3xl">
                                        <PillDisplay type="asset" asset={'BTC'} value={0} />
                                    </Loader>
                                ) : (
                                    renderTopAssetsList(topSuppliedAssets).map((el, i) => (
                                        <button
                                            key={`top-supplied-asset-${i}`}
                                            onClick={(e) =>
                                                handlePillClick(
                                                    el.asset,
                                                    el.trancheId,
                                                    el.trancheName,
                                                )
                                            }
                                        >
                                            <PillDisplay
                                                type="asset"
                                                asset={el.asset}
                                                value={makeCompact(el.amount)}
                                                hoverable
                                            />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Borrowed"
                            value={totalBorrowed ? totalBorrowed : '-'}
                            loading={isLoading}
                        />
                        <div className="flex flex-col gap-1">
                            <span>Top Borrowed Assets</span>
                            <div className="flex flex-wrap gap-1">
                                {isLoading ? (
                                    <Loader variant="rounded" className="!rounded-3xl">
                                        <PillDisplay type="asset" asset={'BTC'} value={0} />
                                    </Loader>
                                ) : (
                                    renderTopAssetsList(topBorrowedAssets).map((el, i) => (
                                        <button
                                            key={`top-borrowed-asset-${i}`}
                                            onClick={(e) =>
                                                handlePillClick(
                                                    el.asset,
                                                    el.trancheId,
                                                    el.trancheName,
                                                )
                                            }
                                        >
                                            <PillDisplay
                                                type="asset"
                                                asset={el.asset}
                                                value={makeCompact(el.amount)}
                                                hoverable
                                            />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 lg:col-span-2 2xl:col-span-1">
                        <span>Top Tranches</span>
                        <div className="flex flex-col">
                            <TopTranchesTable data={topTranches || []} loading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

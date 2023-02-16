import React from 'react';
import { TopTranchesTable } from '../../tables';
import { useWindowSize } from '../../../hooks';
import { makeCompact } from '../../../utils/helpers';
import { AssetBalance, TrancheData } from '@app/api/types';
import {
    SkeletonLoader,
    ReLineChart,
    NumberDisplay,
    PillDisplay,
    Card,
    ILineChartDataPointProps,
} from '../../components';
import { UseQueryResult } from '@tanstack/react-query';

export interface ITrancheStatsCardProps {
    tvl?: string;
    reserve?: string;
    lenders?: number;
    borrowers?: number;
    totalSupplied?: string;
    totalBorrowed?: string;
    topBorrowedAssets?: AssetBalance[];
    topSuppliedAssets?: AssetBalance[];
    tvlChart?: UseQueryResult<ILineChartDataPointProps[], unknown>;
    isLoading?: boolean;
}

export const TrancheStatsCard: React.FC<ITrancheStatsCardProps> = ({
    tvl,
    reserve,
    lenders,
    borrowers,
    totalBorrowed,
    totalSupplied,
    topBorrowedAssets,
    topSuppliedAssets,
    isLoading,
    tvlChart,
}) => {
    const { width } = useWindowSize();

    const renderTopAssetsList = (_arr: AssetBalance[] | undefined) => {
        if (!_arr) return [];
        else {
            const arr = _arr.filter(
                (el) => parseFloat(el.amount.includes('$') ? el.amount.slice(1) : el.amount) !== 0,
            );
            if (width > 1536) {
                return arr;
            } else {
                return arr.slice(0, 4);
            }
        }
    };

    return (
        <Card>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-neutral-300 dark:divide-neutral-800">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <NumberDisplay
                            size="xl"
                            label="Total Value Locked (TVL)"
                            value={tvl ? makeCompact(tvl, true) : '-'}
                            labelClass="text-2xl"
                            loading={isLoading}
                        />
                        {tvlChart?.isLoading ? (
                            <SkeletonLoader
                                variant="rounded"
                                animtion="wave"
                                className="min-w-full"
                            >
                                <div className="h-[100px] w-full">
                                    <ReLineChart
                                        data={tvlChart?.data || []}
                                        color="#3CB55E"
                                        type="usd"
                                    />
                                </div>
                            </SkeletonLoader>
                        ) : (
                            <div className="h-[100px] w-full">
                                <ReLineChart
                                    data={tvlChart?.data || []}
                                    color="#3CB55E"
                                    type="usd"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <NumberDisplay
                            label={'Reserves:'}
                            value={reserve || reserve === '0' ? reserve : '-'}
                            loading={isLoading}
                        />
                        <NumberDisplay
                            color="text-brand-purple"
                            label={'Lenders:'}
                            value={lenders || lenders === 0 ? lenders : '-'}
                            loading={isLoading}
                        />
                        <NumberDisplay
                            color="text-brand-green"
                            label={'Borrowers:'}
                            value={borrowers || borrowers === 0 ? borrowers : '-'}
                            loading={isLoading}
                        />
                    </div>
                </div>

                <div className="py-2 md:py-4 xl:py-0 xl:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Supplied"
                            value={totalSupplied ? totalSupplied : '-'}
                            loading={isLoading}
                        />
                        <div className="flex flex-col gap-1">
                            <span>Top Supplied Assets</span>
                            <div className="flex flex-wrap gap-1">
                                {isLoading ? (
                                    <SkeletonLoader variant="rounded" className="!rounded-3xl">
                                        <PillDisplay type="asset" asset={'BTC'} value={0} />
                                    </SkeletonLoader>
                                ) : (
                                    renderTopAssetsList(topSuppliedAssets).map((el, i) => (
                                        <PillDisplay
                                            key={`top-asset-${i}`}
                                            type="asset"
                                            asset={el.asset}
                                            value={makeCompact(el.amount)}
                                        />
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
                                    <SkeletonLoader variant="rounded" className="!rounded-3xl">
                                        <PillDisplay type="asset" asset={'BTC'} value={0} />
                                    </SkeletonLoader>
                                ) : (
                                    renderTopAssetsList(topBorrowedAssets).map((el, i) => (
                                        <PillDisplay
                                            key={`top-asset-${i}`}
                                            type="asset"
                                            asset={el.asset}
                                            value={makeCompact(el.amount)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

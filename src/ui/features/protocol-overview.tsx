import { Card } from '../components/cards';
import React from 'react';
import { ReLineChart } from '../components/charts';
import { NumberDisplay, PillDisplay } from '../components/displays';
import { TopTranchesTable } from '../tables';
import { useWindowSize } from '../../hooks/ui';
import { makeCompact } from '../../utils/helpers';
import { useSubgraphProtocolData } from '../../api';
import { AssetBalance, TrancheData } from '@app/api/types';

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
}) => {
    const { queryProtocolTVLChart } = useSubgraphProtocolData();
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
        <Card loading={isLoading}>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Total Value Locked (TVL)</h2>
                            <p className="text-3xl">{tvl ? makeCompact(tvl, true) : '-'}</p>
                        </div>
                        <div className="h-[100px] w-full">
                            <ReLineChart data={queryProtocolTVLChart.data || []} color="#3CB55E" />
                        </div>
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <NumberDisplay
                            label={'Reserves:'}
                            value={reserve ? makeCompact(reserve) : '-'}
                        />
                        <NumberDisplay
                            color="text-brand-purple"
                            label={'Lenders:'}
                            value={lenders}
                        />
                        <NumberDisplay
                            color="text-brand-green"
                            label={'Borrowers:'}
                            value={borrowers}
                        />
                        <NumberDisplay label={'Markets:'} value={markets} />
                    </div>
                </div>

                <div className="py-2 md:py-4 xl:py-0 xl:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Supplied"
                            value={totalSupplied ? totalSupplied : '-'}
                        />
                        <div className="flex flex-col gap-1">
                            <span>Top Supplied Assets</span>
                            <div className="flex flex-wrap gap-1">
                                {renderTopAssetsList(topSuppliedAssets).map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={el.asset}
                                        value={makeCompact(el.amount)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Borrowed"
                            value={totalBorrowed ? totalBorrowed : '-'}
                        />
                        <div className="flex flex-col gap-1">
                            <span>Top Borrowed Assets</span>
                            <div className="flex flex-wrap gap-1">
                                {renderTopAssetsList(topBorrowedAssets).map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={el.asset}
                                        value={makeCompact(el.amount)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span>Top Tranches</span>
                        <div className="flex flex-col">
                            <TopTranchesTable data={topTranches || []} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

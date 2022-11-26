import { Card } from '../../components/cards';
import React from 'react';
import { ILineChartDataPointProps, ReLineChart } from '../../components/charts';
import { NumberDisplay, PillDisplay } from '../../components/displays';
import { TopTranchesTable } from '../../tables';
import { bigNumberToUSD } from '../../../utils/helpers';
import { useWindowSize } from '../../../hooks/ui';
import { BigNumber } from 'ethers';
import { TrancheData } from '@vmex/sdk';

export interface AssetBalance {
    asset: string;
    amount: string;
}
export interface IProtocolProps {
    isLoading?: boolean;
    tvl?: string;
    reserve?: string;
    lenders?: number;
    borrowers?: number;
    markets?: number;
    graphData?: ILineChartDataPointProps[];
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
    graphData,
    totalBorrowed,
    totalSupplied,
    topBorrowedAssets,
    topSuppliedAssets,
    topTranches,
    isLoading,
}) => {
    const { width } = useWindowSize();
    const renderTopAssetsList = (arr: any[] | undefined) => {
        if (arr) {
            if (width > 1536) {
                return arr;
            } else {
                return arr.slice(0, 4);
            }
        } else {
            return [];
        }
    };

    return (
        <Card loading={isLoading}>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Total Value Locked (TVL)</h2>
                            <p className="text-3xl">{tvl ? tvl : '-'}</p>
                        </div>
                        <div className="h-[100px] w-full">
                            <ReLineChart data={graphData || []} color="#3CB55E" />
                        </div>
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <NumberDisplay label={'Reserves:'} value={reserve ? reserve : '-'} />
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
                                        value={el.amount}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <NumberDisplay size="xl" label="Total Borrowed" value={totalBorrowed} />
                        <div className="flex flex-col gap-1">
                            <span>Top Borrowed Assets</span>
                            <div className="flex flex-wrap gap-1">
                                {renderTopAssetsList(topBorrowedAssets).map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={el.asset}
                                        value={el.amount}
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

import { Card } from '../../components/cards';
import React from 'react';
import { IDataProps, ReLineChart } from '../../components/charts';
import { lineData2, mockTopAssets, mockTopTranches } from '../../../utils/mock-data';
import { NumberDisplay, PillDisplay } from '../../components/displays';
import { TopTranchesTable } from '../../tables';

export interface IProtocolProps {
    tvl?: number;
    reserve?: number;
    lenders?: number;
    borrowers?: number;
    markets?: number;
    graphData?: IDataProps[];
}

const TVLDataCard: React.FC<IProtocolProps> = ({
    tvl,
    reserve,
    lenders,
    borrowers,
    markets,
    graphData,
}) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
    });
    return (
        <Card>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Total Value Locked (TVL)</h2>
                            <p className="text-3xl">{tvl ? formatter.format(tvl as number) : ''}</p>
                        </div>
                        <div className="h-[100px] w-full">
                            <ReLineChart data={graphData || lineData2} color="#3CB55E" />
                        </div>
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <NumberDisplay
                            label={'Reserves:'}
                            value={reserve ? formatter.format(reserve as number) : ''}
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
                        <NumberDisplay size="xl" label="Total Supplied" value={`$${'157.08'}M`} />
                        <div className="flex flex-col gap-1">
                            <span>Top Supplied Assets</span>
                            {/* Dummy Data */}
                            {/* TODO: at 1600px, only top 3 should show */}
                            <div className="flex flex-wrap gap-1">
                                {mockTopAssets.map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={`${el.asset}`}
                                        value={`$${el.val}M`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <NumberDisplay size="xl" label="Total Borrowed" value={`$${'129.31'}M`} />
                        <div className="flex flex-col gap-1">
                            <span>Top Borrowed Assets</span>
                            {/* Dummy Data */}
                            {/* TODO: at 1600px, only top 3 should show */}
                            <div className="flex flex-wrap gap-1">
                                {mockTopAssets.map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={`${el.asset}`}
                                        value={`$${el.val}M`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span>Top Tranches</span>
                        <div className="flex flex-col">
                            <TopTranchesTable data={mockTopTranches} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export { TVLDataCard };

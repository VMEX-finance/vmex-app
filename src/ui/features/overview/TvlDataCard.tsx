import { Card } from '../../components/cards';
import React from 'react';
import { ReLineChart } from '../../components/charts';
import { lineData2 } from '../../../utils/mock-data';
import { Number, PillDisplay } from '../../components/displays';

export interface ITVLData {
    tvl?: number;
    reserve?: number;
    lenders?: number;
    borrowers?: number;
    markets?: number;
    graphData?: number[];
}

const TVLDataCard: React.FC<ITVLData> = ({
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
            <div className="flex flex-col lg:flex-row gap-2 md:gap-4 lg:gap-6 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Total Value Locked (TVL)</h2>
                            <p className="text-3xl">{tvl ? formatter.format(tvl as number) : ''}</p>
                        </div>
                        <div className="h-[100px] w-full">
                            <ReLineChart data={lineData2} color="#3CB55E" />
                        </div>
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <Number
                            label={'Reserves:'}
                            value={reserve ? formatter.format(reserve as number) : ''}
                        />
                        <Number color="text-brand-purple" label={'Lenders:'} value={lenders} />
                        <Number color="text-brand-green" label={'Borrowers:'} value={borrowers} />
                        <Number label={'Markets:'} value={markets} />
                    </div>
                </div>

                <div className="py-2 md:py-4 lg:py-0 lg:px-6 flex flex-col lg:flex-row gap-6 2xl:gap-32 w-full">
                    <div className="flex flex-col gap-2">
                        <Number size="xl" label="Total Supplied" value={`$${'157.08'}M`} />
                        <div className="flex flex-col gap-1">
                            <span>Top Supplied Assets</span>
                            {/* Dummy Data */}
                            {/* TODO: at 1600px, only top 3 should show */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">
                                {[1, 2, 3, 4, 5, 6].map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={`BTC`}
                                        value={`$30.2M`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Number size="xl" label="Total Borrowed" value={`$${'129.31'}M`} />
                        <div className="flex flex-col gap-1">
                            <span>Top Borrowed Assets</span>
                            {/* Dummy Data */}
                            {/* TODO: at 1600px, only top 3 should show */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">
                                {[1, 2, 3, 4, 5, 6].map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={`BTC`}
                                        value={`$30.2M`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span>Tranches Summary</span>
                        <div className="flex flex-col"></div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export { TVLDataCard };

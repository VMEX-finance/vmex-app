import { Card } from '../../components/cards';
import React from 'react';
import { IDataProps, ReLineChart } from '../../components/charts';
import { MOCK_LINE_DATA_2, MOCK_TOP_ASSETS, MOCK_TOP_TRANCHES } from '../../../utils/mock-data';
import { NumberDisplay, PillDisplay } from '../../components/displays';
import { TopTranchesTable } from '../../tables';
import { usdFormatter } from '../../../utils/helpers';

export interface IProtocolProps {
    tvl?: number;
    reserve?: number;
    lenders?: number;
    borrowers?: number;
    markets?: number;
    graphData?: IDataProps[];
}

export const ProtocolTVLDataCard: React.FC<IProtocolProps> = ({
    tvl,
    reserve,
    lenders,
    borrowers,
    markets,
    graphData,
}) => {
    return (
        <Card>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Total Value Locked (TVL)</h2>
                            <p className="text-3xl">
                                {tvl ? usdFormatter.format(tvl as number) : ''}
                            </p>
                        </div>
                        <div className="h-[100px] w-full">
                            <ReLineChart data={graphData || MOCK_LINE_DATA_2} color="#3CB55E" />
                        </div>
                    </div>
                    <div className="flex md:flex-col justify-between gap-1">
                        <NumberDisplay
                            label={'Reserves:'}
                            value={reserve ? usdFormatter.format(reserve as number) : ''}
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
                            <div className="flex flex-wrap gap-1">
                                {MOCK_TOP_ASSETS.map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={`${el.asset}`}
                                        value={el.val}
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
                            <div className="flex flex-wrap gap-1">
                                {MOCK_TOP_ASSETS.map((el, i) => (
                                    <PillDisplay
                                        key={`top-asset-${i}`}
                                        type="asset"
                                        asset={`${el.asset}`}
                                        value={el.val}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span>Top Tranches</span>
                        <div className="flex flex-col">
                            {/* Dummy Data */}
                            <TopTranchesTable data={MOCK_TOP_TRANCHES} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

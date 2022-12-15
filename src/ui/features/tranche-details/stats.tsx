import { ReLineChart } from '../../components/charts';
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/cards';
import { MOCK_MULTI_LINE_DATA } from '../../../utils/mock-data';
import { DropdownButton } from '../../components/buttons';
import ReactTooltip from 'react-tooltip';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { NumberDisplay } from '../../components/displays';
import { IGraphTrancheAssetProps } from '../../../api/subgraph/types';
import { numberFormatter, percentFormatter } from '../../../utils/helpers';
import { useTrancheMarketsData } from '../../../api';

type ITrancheStatisticsCardProps = {
    tranche?: any;
    assetData?: IGraphTrancheAssetProps;
    loading?: boolean;
};

export const TrancheStatisticsCard = ({
    tranche,
    assetData,
    loading,
}: ITrancheStatisticsCardProps) => {
    const { asset, setAsset } = useSelectedTrancheContext();
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        if (!asset) setAsset(tranche.assets[0]);
    }, []);

    // Re-render for charts
    useEffect(() => {
        setRerender(true);
        const timeout = setTimeout(() => setRerender(false), 100);
        return () => clearTimeout(timeout);
    }, [asset]);

    return (
        <>
            <Card black loading={loading || !assetData || rerender} className="min-h-[852px]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl">Asset Statistics</h3>
                        {/* TODO: Make this dynamic based on if strategy */}
                        {asset === 'triCrypto2' && (
                            <div
                                data-tip
                                data-for="strategiesTip"
                                className="bg-white text-neutral-700 text-sm rounded px-2 border-2 border-brand-purple cursor-default"
                            >
                                <span>Strategies Enabled</span>
                            </div>
                        )}
                    </div>
                    <DropdownButton
                        primary
                        size="lg"
                        items={tranche.assets.map((el: any) => ({ text: el }))}
                        selected={asset}
                        setSelected={setAsset}
                    />
                </div>
                {MOCK_MULTI_LINE_DATA && MOCK_MULTI_LINE_DATA.length > 0 && (
                    <div className="flex gap-6 mb-3 mt-1">
                        <NumberDisplay
                            label="Supply APY"
                            value={`${percentFormatter.format(assetData?.supplyRate)}`}
                            color="text-brand-green"
                        />
                        <NumberDisplay
                            label="Borrow APY"
                            value={percentFormatter.format(assetData?.borrowRate)}
                            color="text-brand-purple"
                        />
                        <NumberDisplay
                            label="Optimal Utilization"
                            value={percentFormatter.format(assetData?.optimalUtilityRate)}
                            color="text-white"
                        />
                    </div>
                )}
                <div className="flex flex-col justify-between gap-6">
                    <div className="grid grid-cols-1 w-full gap-6 xl:gap-10">
                        <div className="w-full h-[240px]">
                            <ReLineChart
                                data={MOCK_MULTI_LINE_DATA} // TODO
                                color="#3CB55E"
                                color2="#7667db"
                                type="asset-stats"
                                timeseries
                                xaxis
                                yaxis
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-lg">Utilization Curve</span>
                            <div className="w-full h-[120px]">
                                <ReLineChart
                                    data={[0, 50, 100].map((el, i) => ({
                                        xaxis:
                                            i === 1
                                                ? parseFloat(assetData?.optimalUtilityRate) * 100
                                                : el,
                                        value: i === 2 ? 100 : 0,
                                    }))}
                                    color="#fff"
                                    type="utilization"
                                    yaxis
                                    xaxis
                                    noTooltip
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 justify-items-center gap-y-10">
                        <NumberDisplay
                            label="LTV"
                            value={assetData?.ltv}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Liq. Threshold"
                            value={assetData?.liquidationThreshold}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Liq. Penalty"
                            value={`${percentFormatter.format(assetData?.liquidationPenalty)}`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Collateral"
                            value={`${assetData?.collateral ? 'Yes' : 'No'}`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Oracle"
                            value={assetData?.oracle}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Total Supplied"
                            value={`${numberFormatter.format(assetData?.totalSupplied)} ${asset}`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Utilization"
                            value={percentFormatter.format(assetData?.utilityRate)}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Total Borrowed"
                            value={`${numberFormatter.format(assetData?.totalBorrowed)} ${asset}`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Admin Fee"
                            value={`${tranche.adminFee || 1}%`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Platform Fee"
                            value={`${tranche.platformFee || 1}%`} // TODO
                            color="text-white"
                            center
                        />
                    </div>
                </div>
            </Card>

            <ReactTooltip id="strategiesTip" place="top" effect="solid">
                When deposited, {asset || 'this asset'} is deployed into a VMEX strategy. Your{' '}
                {asset || 'asset'} will be staked on Convex and earned rewards will be automatically
                compounded back into your underlying position.
            </ReactTooltip>
        </>
    );
};

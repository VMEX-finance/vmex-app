import { ReLineChart } from '../../components/charts';
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/cards';
import { DropdownButton } from '../../components/buttons';
import ReactTooltip from 'react-tooltip';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { NumberDisplay } from '../../components/displays';
import { IGraphTrancheAssetProps, IGraphTrancheDataProps } from '../../../api/subgraph/types';
import { numberFormatter, percentFormatter } from '../../../utils/helpers';
import { useSubgraphMarketsData } from '../../../api/subgraph';

type ITrancheStatisticsCardProps = {
    tranche?: IGraphTrancheDataProps | any;
    trancheId: string;
    assetData?: IGraphTrancheAssetProps;
    loading?: boolean;
};

export const TrancheStatisticsCard = ({
    tranche,
    trancheId,
    assetData,
    loading,
}: ITrancheStatisticsCardProps) => {
    const { asset, setAsset } = useSelectedTrancheContext();
    const [rerender, setRerender] = useState(false);
    const { queryMarketsChart } = useSubgraphMarketsData(trancheId, asset);

    useEffect(() => {
        if (!asset && tranche?.assets) setAsset(tranche.assets[0]);
    }, [tranche]);

    // Re-render for charts
    useEffect(() => {
        setRerender(true);
        const timeout = setTimeout(() => setRerender(false), 300);
        return () => clearTimeout(timeout);
    }, [asset]);

    return (
        <>
            <Card black loading={loading || !assetData || rerender}>
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
                        items={
                            tranche && tranche.assets
                                ? tranche.assets.map((el: any) => ({ text: el }))
                                : []
                        }
                        selected={asset}
                        setSelected={setAsset}
                    />
                </div>
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

                <div className="flex flex-col justify-between gap-6">
                    <div className="grid grid-cols-1 w-full gap-6 xl:gap-10">
                        <div className="w-full h-[240px]">
                            <ReLineChart
                                data={queryMarketsChart.data?.supplyBorrowRateChart || []}
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
                                    data={queryMarketsChart.data?.utilizationChart || []}
                                    color="#fff"
                                    type="utilization"
                                    yaxis
                                    xaxis
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
                            value={percentFormatter.format(assetData?.reserveFactor)}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Platform Fee"
                            value={percentFormatter.format(tranche?.platformFee)}
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

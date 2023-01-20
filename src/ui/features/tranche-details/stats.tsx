import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { useSelectedTrancheContext } from '../../../store';
import { NumberDisplay, DefaultDropdown, Card, ReLineChart } from '../../components';
import { IGraphTrancheAssetProps, IGraphTrancheDataProps } from '../../../api/subgraph/types';
import {
    numberFormatter,
    percentFormatter,
    convertContractsPercent,
    ZERO_ADDRESS,
    MAX_UINT_AMOUNT,
} from '../../../utils';
import { useSubgraphMarketsData } from '../../../api/subgraph';
import { TbInfinity } from 'react-icons/tb';

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
            <Card
                black
                loading={loading || !assetData || rerender}
                header={
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl">Asset Statistics</h3>
                            {queryMarketsChart.data?.yieldStrategy &&
                                queryMarketsChart.data.yieldStrategy != ZERO_ADDRESS && (
                                    <div
                                        data-tip
                                        data-for="strategiesTip"
                                        className="bg-white text-neutral-700 text-sm rounded px-2 border-2 border-brand-purple cursor-default"
                                    >
                                        <span>Strategies Enabled</span>
                                    </div>
                                )}
                        </div>
                        <DefaultDropdown
                            primary
                            size="lg"
                            items={
                                tranche && tranche.assets
                                    ? tranche.assets.map((el: any) => ({ text: el }))
                                    : []
                            }
                            selected={asset || 'Loading'}
                            setSelected={setAsset}
                        />
                    </div>
                }
            >
                <div className="flex gap-6 mb-3 mt-1">
                    <NumberDisplay
                        label="Supply APY"
                        value={`${assetData?.supplyRate}`}
                        color="text-brand-green"
                    />
                    <NumberDisplay
                        label="Borrow APY"
                        value={assetData?.borrowRate}
                        color="text-brand-purple"
                    />
                    <NumberDisplay
                        label="Optimal Utilization"
                        value={assetData?.optimalUtilityRate}
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
                            value={percentFormatter.format(
                                Number(convertContractsPercent(assetData?.ltv)),
                            )}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Borrow Factor"
                            value={percentFormatter.format(
                                Number(convertContractsPercent(assetData?.borrowFactor)),
                            )}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Liq. Threshold"
                            value={percentFormatter.format(
                                Number(convertContractsPercent(assetData?.liquidationThreshold)),
                            )}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Liq. Bonus"
                            value={`${percentFormatter.format(
                                Number(convertContractsPercent(assetData?.liquidationBonus)),
                            )}`}
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
                            label="Supply Cap"
                            value={
                                assetData?.supplyCap == MAX_UINT_AMOUNT ? (
                                    <TbInfinity color="text-white" />
                                ) : (
                                    `${numberFormatter.format(assetData?.supplyCap)} ${asset}`
                                )
                            }
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Borrow Cap"
                            value={
                                assetData?.borrowCap == MAX_UINT_AMOUNT ? (
                                    <TbInfinity color="text-white" />
                                ) : (
                                    `${numberFormatter.format(assetData?.borrowCap)} ${asset}`
                                )
                            }
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
                            label="Tranche Admin Fee"
                            value={percentFormatter.format(
                                Number(convertContractsPercent(assetData?.reserveFactor)),
                            )}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Platform Fee"
                            value={percentFormatter.format(
                                Number(convertContractsPercent(assetData?.vmexReserveFactor)),
                            )}
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

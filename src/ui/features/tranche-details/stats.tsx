import React, { useEffect, useState } from 'react';
import { useSelectedTrancheContext } from '@/store';
import { NumberDisplay, DefaultDropdown, Card, ReLineChart, ApyToolitp } from '@/ui/components';
import { IGraphTrancheAssetProps, IGraphTrancheDataProps } from '@/api';
import {
    numberFormatter,
    percentFormatter,
    convertContractsPercent,
    MAX_UINT_AMOUNT,
} from '@/utils';
import { useSubgraphMarketsData } from '@/api';
import { TbInfinity } from 'react-icons/tb';
import { ethers } from 'ethers';
import { useWindowSize } from '@/hooks';

type ITrancheStatisticsCardProps = {
    tranche?: IGraphTrancheDataProps;
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
    const { width, breakpoints } = useWindowSize();
    const [rerender, setRerender] = useState(false);
    const { queryMarketsChart } = useSubgraphMarketsData(trancheId, asset);

    const renderDropdown = (hasUtility = true) => {
        if (!tranche?.assetsData || !asset) return [];
        const mappedObj = Object.entries(tranche.assetsData);
        if (hasUtility) {
            return mappedObj.map((el) => ({ text: el[0] }));
        } else {
            const filtered = mappedObj.filter((el) => el[1].utilityRate !== '0');
            return filtered.map((el) => ({ text: el[0] }));
        }
    };

    useEffect(() => {
        if (!asset && tranche?.assets) setAsset(tranche.assets[0]);
    }, [tranche]);

    // Re-render for charts
    useEffect(() => {
        setRerender(true);
        const timeout = setTimeout(() => setRerender(false), 750);
        return () => clearTimeout(timeout);
    }, [asset]);

    return (
        <>
            <Card
                black
                loading={(loading || !assetData || rerender) && !queryMarketsChart.isError}
                header={
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl">
                                {width < breakpoints.sm ? 'Asset Stats' : 'Asset Statistics'}
                            </h3>
                            {asset?.toLowerCase().startsWith('yv') && (
                                <div
                                    data-tip
                                    data-for="strategiesTip"
                                    className="bg-neutral-200 text-neutral-700 text-sm rounded px-2 border-2 border-brand-purple cursor-default"
                                >
                                    <span>Strategies Enabled</span>
                                </div>
                            )}
                        </div>
                        <DefaultDropdown
                            primary
                            size="lg"
                            items={renderDropdown()}
                            selected={asset || 'Loading'}
                            setSelected={setAsset}
                            className="!text-neutral-100"
                        />
                    </div>
                }
            >
                <>{console.log('assetData', assetData)}</>
                <div className="flex gap-6 mb-3 mt-1">
                    <NumberDisplay
                        label="Supply APY"
                        value={<ApyToolitp symbol={asset} oldApy={String(assetData?.supplyRate)} />}
                        color="text-brand-green"
                    />
                    <NumberDisplay
                        label="Borrow APY"
                        value={percentFormatter.format(Number(assetData?.borrowRate) || 0)}
                        color="text-brand-purple"
                    />
                    <NumberDisplay
                        label="Optimal Utilization"
                        value={(assetData?.optimalUtilityRate as any) || 'N/A'}
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
                                error={queryMarketsChart.isError}
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
                                    error={queryMarketsChart.isError}
                                />
                            </div>
                        </div>
                    </div>
                    {!queryMarketsChart.isError && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 justify-items-center gap-y-10">
                            <NumberDisplay
                                label="LTV"
                                value={percentFormatter.format(
                                    Number(
                                        convertContractsPercent(
                                            assetData?.baseLTV as string,
                                            Number(assetData?.decimals),
                                        ),
                                    ),
                                )}
                                color="text-white"
                                align="center"
                            />
                            {assetData?.canBeBorrowed && (
                                <NumberDisplay
                                    label="Borrow Factor"
                                    value={percentFormatter.format(
                                        Number(
                                            convertContractsPercent(
                                                assetData?.borrowFactor as string,
                                                Number(assetData?.decimals),
                                            ),
                                        ),
                                    )}
                                    color="text-white"
                                    align="center"
                                />
                            )}
                            <NumberDisplay
                                label="Liq. Threshold"
                                value={percentFormatter.format(
                                    Number(
                                        convertContractsPercent(
                                            assetData?.liquidationThreshold as string,
                                            Number(assetData?.decimals),
                                        ),
                                    ),
                                )}
                                color="text-white"
                                align="center"
                            />
                            <NumberDisplay
                                label="Liq. Bonus"
                                value={`${percentFormatter.format(
                                    Number(
                                        convertContractsPercent(
                                            assetData?.liquidationBonus as string,
                                            Number(assetData?.decimals),
                                        ),
                                    ),
                                )}`}
                                color="text-white"
                                align="center"
                            />
                            <NumberDisplay
                                label="Collateral"
                                value={`${assetData?.collateral ? 'Yes' : 'No'}`}
                                color="text-white"
                                align="center"
                            />
                            <NumberDisplay
                                label="Supply Cap"
                                value={
                                    assetData?.supplyCap == MAX_UINT_AMOUNT ? (
                                        <TbInfinity color="text-white" />
                                    ) : (
                                        `${numberFormatter.format(
                                            ethers.utils.formatUnits(
                                                assetData?.supplyCap
                                                    ? (assetData?.supplyCap as any)
                                                    : 0,
                                                assetData?.decimals
                                                    ? (assetData?.decimals as any)
                                                    : 0,
                                            ) as any,
                                        )}`
                                    )
                                }
                                color="text-white"
                                align="center"
                            />
                            {assetData?.canBeBorrowed && (
                                <NumberDisplay
                                    label="Borrow Cap"
                                    value={
                                        assetData?.borrowCap == MAX_UINT_AMOUNT ? (
                                            <TbInfinity color="text-white" />
                                        ) : (
                                            `${numberFormatter.format(
                                                ethers.utils.formatUnits(
                                                    assetData?.borrowCap
                                                        ? (assetData?.borrowCap as any)
                                                        : 0,
                                                    assetData?.decimals
                                                        ? (assetData?.decimals as any)
                                                        : 0,
                                                ) as any,
                                            )}`
                                        )
                                    }
                                    color="text-white"
                                    align="center"
                                />
                            )}
                            <NumberDisplay
                                label="Oracle"
                                value={assetData?.oracle as any}
                                color="text-white"
                                align="center"
                            />
                            <NumberDisplay
                                label="Total Supplied"
                                value={`${numberFormatter.format(assetData?.totalSupplied as any)}`}
                                color="text-white"
                                align="center"
                            />
                            <NumberDisplay
                                label="Utilization"
                                value={percentFormatter.format(assetData?.utilityRate as any)}
                                color="text-white"
                                align="center"
                            />
                            {assetData?.canBeBorrowed && (
                                <NumberDisplay
                                    label="Total Borrowed"
                                    value={`${numberFormatter.format(
                                        assetData?.totalBorrowed as any,
                                    )}`}
                                    color="text-white"
                                    align="center"
                                />
                            )}
                            <NumberDisplay
                                label="Tranche Admin Fee"
                                value={percentFormatter.format(
                                    Number(
                                        convertContractsPercent(
                                            assetData?.reserveFactor as any,
                                            Number(assetData?.decimals),
                                        ),
                                    ),
                                )}
                                color="text-white"
                                align="center"
                            />
                            <NumberDisplay
                                label="Platform Fee"
                                value={percentFormatter.format(
                                    Number(
                                        convertContractsPercent(
                                            assetData?.vmexReserveFactor as any,
                                            Number(assetData?.decimals),
                                        ),
                                    ),
                                )}
                                color="text-white"
                                align="center"
                            />
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

import { ReLineChart } from '../../components/charts';
import React from 'react';
import { Card } from '../../components/cards';
import { MOCK_MULTI_LINE_DATA, MOCK_UTILITIZATION_LINE_DATA } from '../../../utils/mock-data';
import { DropdownButton } from '../../components/buttons';
import ReactTooltip from 'react-tooltip';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { NumberDisplay } from '../../components/displays';

// TODO: Implement interface
export const TrancheStatisticsCard = ({ tranche }: any) => {
    const { asset, setAsset } = useSelectedTrancheContext();
    return (
        <>
            <Card black>
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
                        selected={asset || tranche.assets[0]}
                        setSelected={setAsset}
                    />
                </div>
                {MOCK_MULTI_LINE_DATA && MOCK_MULTI_LINE_DATA.length > 0 && (
                    <div className="flex gap-6 mb-3 mt-1">
                        <NumberDisplay
                            label="Supply APY"
                            value={`${
                                MOCK_MULTI_LINE_DATA[MOCK_MULTI_LINE_DATA.length - 1].value
                            }%`}
                            color="text-brand-green"
                        />
                        <NumberDisplay
                            label="Borrow APY"
                            value={`${
                                MOCK_MULTI_LINE_DATA[MOCK_MULTI_LINE_DATA.length - 1].value2
                            }%`}
                            color="text-brand-purple"
                        />
                        <NumberDisplay
                            label="Optimal Utilization"
                            value={`80%`}
                            color="text-white"
                        />
                    </div>
                )}
                <div className="flex flex-col justify-between gap-6">
                    <div className="grid grid-cols-1 w-full gap-6 xl:gap-10">
                        <div className="w-full h-[240px]">
                            <ReLineChart
                                data={MOCK_MULTI_LINE_DATA}
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
                                    data={MOCK_UTILITIZATION_LINE_DATA}
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
                            value={`${(Math.random() * 50).toFixed(1)}%`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Liq. Threshold"
                            value={`${(Math.random() * 10).toFixed(1)}%`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Liq. Penalty"
                            value={`${(Math.random() * 5).toFixed(1)}%`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Collateral"
                            value={`${Math.floor(Math.random() * 10) > 5 ? 'Yes' : 'No'}`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Oracle"
                            value={`${tranche.oracle || 'Chainlink'}`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Total Supplied"
                            value={`$${(Math.random() * 2).toFixed(2)}M`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Utilization"
                            value={`${(Math.random() * 99).toFixed(2)}%`}
                            color="text-white"
                            center
                        />
                        <NumberDisplay
                            label="Total Borrowed"
                            value={`$${(Math.random() * 1).toFixed(2)}M`}
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
                            value={`${(Math.random() * 5).toFixed(1)}%`}
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

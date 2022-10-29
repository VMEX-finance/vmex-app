import { ReLineChart } from '../../components/charts';
import React from 'react';
import { Card } from '../../components/cards';
import { mockMultiLineData } from '../../../utils/mock-data';
import { DropdownButton } from '../../components/buttons';
import ReactTooltip from 'react-tooltip';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { NumberDisplay } from '../../components/displays';
// TODO: Implement interface
export const TrancheStatisticsCard = ({ tranche }: any) => {
    const { asset, setAsset } = useSelectedTrancheContext();
    console.log(mockMultiLineData[mockMultiLineData.length - 1]?.value);
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
                <div className="flex gap-6 mb-3 mt-1">
                    <NumberDisplay
                        label="Supply APY"
                        value={`${mockMultiLineData[mockMultiLineData.length - 1].value}%`}
                        color="text-brand-green"
                    />
                    <NumberDisplay
                        label="Borrow APY"
                        value={`${mockMultiLineData[mockMultiLineData.length - 1].value2}%`}
                        color="text-white"
                    />
                    <NumberDisplay
                        label="Utilization"
                        value={`${mockMultiLineData[mockMultiLineData.length - 1].value3}%`}
                        color="text-brand-purple"
                    />
                </div>
                <div className="flex flex-col justify-between gap-6 xl:gap-12">
                    <div className="grid grid-cols-1 gap-3 w-full px-3">
                        <div className="grid w-full h-[240px]">
                            <ReLineChart
                                data={mockMultiLineData}
                                color="#3CB55E"
                                type="asset-stats"
                                timeseries
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 justify-items-center gap-y-10">
                        {/* TODO: change all these to the NumberDisplay component and make it come from a "data" prop or whatever you want to name it */}
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>LTV</p>
                            <p className="text-xl">{(Math.random() * 50).toFixed(1)}%</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Liq. Threshold</p>
                            <p className="text-xl">{(Math.random() * 10).toFixed(1)}%</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Liq. Penalty</p>
                            <p className="text-xl">{(Math.random() * 5).toFixed(1)}%</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Collateral</p>
                            <p className="text-xl">
                                {Math.floor(Math.random() * 10) > 5 ? 'Yes' : 'No'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Oracle</p>
                            <p className="text-xl">{tranche.oracle || 'Chainlink'}</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Total Supplied</p>
                            <p className="text-xl">${(Math.random() * 5).toFixed(2)}M</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Utilization</p>
                            <p className="text-xl">{(Math.random() * 99).toFixed(2)}%</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Total Borrowed</p>
                            <p className="text-xl">${(Math.random() * 1).toFixed(2)}M</p>
                        </div>
                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Admin Fee</p>
                            <p className="text-xl">{tranche.adminFee || 1}%</p>
                        </div>

                        <div className="grid grid-cols-1 justify-items-center">
                            <p>Platform Fee</p>
                            <p className="text-xl">{(Math.random() * 5).toFixed(1)}%</p>
                        </div>
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

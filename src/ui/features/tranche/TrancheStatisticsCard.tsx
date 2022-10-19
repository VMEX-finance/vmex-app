import { ReLineChart } from '../../components/charts';
import React from 'react';
import { Card } from '../../components/cards';
import { lineData, lineData2 } from '../../../utils/mock-data';
import { DropdownButton } from '../../components/buttons';

export const TrancheStatisticsCard = ({ tranche }: any) => {
    return (
        <Card black>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-2xl">Statistics</h3>
                {/* TODO: Pull all available coins in tranche */}
                <DropdownButton
                    primary
                    size="lg"
                    items={tranche.assets.map((el: string) => ({ text: el }))}
                />
            </div>
            <div className="flex flex-col h-[90%] justify-between">
                <div className="grid grid-cols-1 gap-3 w-full px-3">
                    <div className="grid w-full h-[240px]">
                        {/* TODO: Make a new chart component that supports 3 lines  - refer to recharts docs*/}
                        <ReLineChart data={lineData} color="#3CB55E" timeseries />
                        <ReLineChart data={lineData2} color="#fff" />
                        <ReLineChart data={lineData} color="#7667db" />
                    </div>
                </div>
                <div className="grid grid-cols-4 justify-items-center gap-y-10">
                    {/* TODO: change all these to the NumberDisplay component and make it come from a "data" prop or whatever you want to name it */}
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>LTV</p>
                        <p className="text-xl">{tranche.ltv}%</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Liquidation Threshold</p>
                        <p className="text-xl">{tranche.liquidThreshold}%</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Liquidation Penalty</p>
                        <p className="text-xl">{tranche.liquidPenalty}%</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Collateral Only</p>
                        <p className="text-xl">{tranche.collateral}</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Total Supplied</p>
                        <p className="text-xl">${tranche.statisticsSupplied}M</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Utilization</p>
                        <p className="text-xl">{tranche.utilization}%</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Total Borrowed</p>
                        <p className="text-xl">${tranche.statisticsBorrowed}M</p>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <p>Reserve Factor</p>
                        <p className="text-xl">{tranche.reserveFactor}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

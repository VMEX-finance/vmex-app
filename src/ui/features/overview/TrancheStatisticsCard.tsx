import { ReLineChart } from '../../components/charts';
import React from 'react';
import { Card } from '../../components/cards';
import { PillDisplay } from '../../components/displays';
import { lineData, lineData2 } from '../../../utils/mock-data';
import { DropdownButton } from '../../components/buttons';

export const TrancheStatisticsCard: React.FC = () => {
    return (
        <Card black>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg">Statistics</h3>
                <DropdownButton primary items={[{ text: 'ETH' }]} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-1 gap-3 w-full px-3">
                <div className="grid w-full h-[240px]">
                    <ReLineChart data={lineData} color="#3CB55E" timeseries />
                </div>
            </div>
            <div className="grid grid-cols-4">
                <div>
                    <p>LTV</p>
                    <p className="text-xl">0%</p>
                </div>
                <div>
                    <p>Liquidation Threshold</p>
                    <p className="text-xl">0%</p>
                </div>
                <div>
                    <p>Liquidation Penalty</p>
                    <p className="text-xl">0%</p>
                </div>
                <div>
                    <p>Collateral Only</p>
                    <p className="text-xl">Yes</p>
                </div>
                <div>
                    <p>Total Supplied</p>
                    <p className="text-xl">$1.25M</p>
                </div>
                <div>
                    <p>Utilization</p>
                    <p className="text-xl">78%</p>
                </div>
                <div>
                    <p>Total Borrowed</p>
                    <p className="text-xl">$1.023M</p>
                </div>
                <div>
                    <p>Reserve Factor</p>
                    <p className="text-xl">0.21</p>
                </div>
            </div>
        </Card>
    );
};

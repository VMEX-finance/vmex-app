import { ReLineChart } from '../../components/charts';
import React from 'react';
import { Card } from '../../components/cards';
import { PillDisplay } from '../../components/displays';
import { MOCK_LINE_DATA, MOCK_LINE_DATA_2 } from '../../../utils/mock-data';
import { DropdownButton } from '../../components/buttons';

// TODO: implement type and change name
export const UserPerformanceCard: React.FC = () => {
    return (
        <Card black>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg">Performance</h3>
                <DropdownButton primary items={[{ text: 'All Tranches' }]} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-1 gap-3 w-full px-3">
                <div className="grid w-full h-[240px]">
                    <h4>Profit / Loss (P&L)</h4>
                    <ReLineChart data={MOCK_LINE_DATA} color="#3CB55E" timeseries />
                </div>
                <div className="grid w-full h-[240px]">
                    <h4>Insurance Utilization</h4>
                    <ReLineChart data={MOCK_LINE_DATA_2} color="#fff" timeseries />
                </div>
            </div>
            <div className="grid">
                <h4 className="mb-2">Assets On Loan</h4>
                {/* Dummy Data */}
                <div className="flex flex-wrap gap-3">
                    <PillDisplay asset="DAI" value={9000} formatter="basic" />
                    <PillDisplay asset="USDC" value={8000} formatter="basic" />
                    <PillDisplay asset="WBTC" value={0.86} formatter="basic" />
                </div>
            </div>
        </Card>
    );
};

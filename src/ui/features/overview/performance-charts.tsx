import { ILineChartDataPointProps, ReLineChart } from '../../components/charts';
import React from 'react';
import { Card } from '../../components/cards';
import { PillDisplay } from '../../components/displays';
import { DropdownButton } from '../../components/buttons';

type ILoanedAssetProps = {
    asset: string;
    amount: number;
};

export type IUserPerformanceCardProps = {
    tranches?: any[];
    profitLossChart?: ILineChartDataPointProps[];
    insuranceChart?: ILineChartDataPointProps[];
    loanedAssets?: ILoanedAssetProps[];
};

// TODO: implement type and change name
export const UserPerformanceCard: React.FC<IUserPerformanceCardProps> = ({
    tranches,
    profitLossChart,
    insuranceChart,
    loanedAssets,
}) => {
    return (
        <Card black>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg">Performance</h3>
                <DropdownButton primary items={tranches || [{ text: 'All Tranches' }]} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-1 gap-3 w-full px-3">
                <div className="grid w-full h-[240px]">
                    <h4>Profit / Loss (P&L)</h4>
                    <ReLineChart data={profitLossChart || []} color="#3CB55E" timeseries />
                </div>
                <div className="grid w-full h-[240px]">
                    <h4>Insurance Utilization</h4>
                    <ReLineChart data={insuranceChart || []} color="#fff" timeseries />
                </div>
            </div>
            {loanedAssets && loanedAssets.length > 0 && (
                <div className="grid">
                    <h4 className="mb-2">Assets On Loan</h4>
                    <div className="flex flex-wrap gap-3">
                        {loanedAssets.map((el, i) => (
                            <PillDisplay
                                key={`${el}-${i}`}
                                asset={el.asset}
                                value={el.amount}
                                formatter="basic"
                            />
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

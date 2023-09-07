import React, { useEffect, useState } from 'react';
import { PillDisplay, Card, ILineChartDataPointProps, ReLineChart } from '@/ui/components';
import { ITrancheInteractedProps } from '@/api';

type ILoanedAssetProps = {
    asset: string;
    amount: string | number;
};

export type IUserPerformanceCardProps = {
    tranches?: ITrancheInteractedProps[];
    profitLossChart?: ILineChartDataPointProps[];
    insuranceChart?: ILineChartDataPointProps[];
    loanedAssets?: ILoanedAssetProps[] | undefined;
    isLoading?: boolean;
};

export const UserPerformanceCard: React.FC<IUserPerformanceCardProps> = ({
    tranches,
    profitLossChart,
    insuranceChart,
    loanedAssets,
    isLoading,
}) => {
    const [tranchesDropdown, setTranchesDropdown] = useState([]);

    useEffect(() => {
        if (tranches) {
            const starter = [{ text: 'All Tranches' }];
            setTranchesDropdown([
                ...starter,
                ...tranches.map(({ id, tranche }) => ({ id, text: tranche })),
            ] as any);
        }
    }, [tranches]);

    return (
        <Card
            black
            loading={isLoading}
            header={
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg">Performance</h3>
                    {/* TODO: filter chart by tranche */}
                    {/* <DefaultDropdown primary items={tranchesDropdown} /> */}
                </div>
            }
        >
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-1 gap-3 w-full px-3"> */}
            <div className="grid grid-cols-1 gap-3 w-full px-3">
                <div className="w-full max-h-[200px] pb-16">
                    <h4>Profit / Loss (P&L)</h4>
                    <ReLineChart
                        data={profitLossChart || []}
                        color="#3CB55E"
                        type="usd"
                        timeseries
                    />
                </div>
                {/* <div className="w-full h-[240px]">
                    <h4>Insurance Utilization</h4>
                    <ReLineChart data={insuranceChart || []} color="#fff" timeseries />
                </div> */}
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

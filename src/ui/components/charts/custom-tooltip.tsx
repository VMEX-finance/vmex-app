import React from 'react';

type ICustomTooltipProps = {
    active?: any;
    payload?: any;
    label?: any;
    type?: 'asset-stats' | 'utilization' | 'default';
};

export const CustomTooltip = ({ active, payload, label, type }: ICustomTooltipProps) => {
    if (active && payload && payload.length) {
        if (type === 'asset-stats') {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span className="font-semibold">{payload[0].payload?.xaxis}</span>
                    <span>Supply APY: {payload[0].value}%</span>
                    <span>Borrow APY: {payload[1].value}%</span>
                </div>
            );
        } else if (type === 'utilization') {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span>Utilization: {payload[0].value}%</span>
                </div>
            );
        } else {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span className="font-semibold">{payload[0].payload?.xaxis}</span>
                    {payload.map((el: any, i: number) => (
                        <span key={`tooltip-${i}`}>Amount: {payload[i].value}</span>
                    ))}
                </div>
            );
        }
    }

    return null;
};

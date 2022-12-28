import { percentFormatter } from '../../../utils/helpers';
import React from 'react';

type ICustomTooltipProps = {
    active?: any;
    payload?: any;
    label?: any;
    type?: 'asset-stats' | 'utilization' | 'usd' | 'default';
};

export const CustomTooltip = ({ active, payload, label, type }: ICustomTooltipProps) => {
    if (active && payload && payload.length) {
        if (type === 'asset-stats') {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span className="font-semibold">{label}</span>
                    <span>Supply APY: {payload[0]?.payload?.value.toFixed(2) || 0}%</span>
                    <span>Borrow APY: {payload[0]?.payload?.value2.toFixed(2) || 0}%</span>
                </div>
            );
        } else if (type === 'utilization') {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span>Utilization: {payload[0]?.value.toFixed(2)}%</span>
                </div>
            );
        } else if (type === 'usd') {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span className="font-semibold">{payload[0]?.payload?.xaxis}</span>
                    {payload.map((el: any, i: number) => (
                        <span key={`tooltip-${i}`}>Amount: ${payload[i]?.value.toFixed(2)}</span>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="bg-black text-white px-2 py-1 flex flex-col">
                    <span className="font-semibold">{payload[0]?.payload?.xaxis}</span>
                    {payload.map((el: any, i: number) => (
                        <span key={`tooltip-${i}`}>Amount: {payload[i]?.value}</span>
                    ))}
                </div>
            );
        }
    }
    return null;
};

import React from 'react';

export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white px-2 py-1 flex flex-col">
                <span className="font-semibold">{payload[0].payload?.date}</span>
                <span>Amount: {payload[0].value}</span>
            </div>
        );
    }

    return null;
};

import React from 'react';

type INumberProps = {
    label?: string;
    value: number | string | React.ReactNode;
    type?: 'basic' | 'exotic';
    color?: 'text-brand-purple' | 'text-brand-green' | 'text-black';
};

export const Number = ({ value, label, type = 'exotic', color = 'text-black' }: INumberProps) => {
    if (type === 'exotic') {
        return (
            <div className="flex flex-col">
                <span>{label}</span>
                <span className="text-brand-purple text-2xl">{value}</span>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col">
                <p className="text-sm">{label}</p>
                <p className={`text-xl ${color}`}>{value}</p>
            </div>
        );
    }
};

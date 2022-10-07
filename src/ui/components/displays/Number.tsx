import React from 'react';

type INumberProps = {
    label?: string;
    value?: number | string | React.ReactNode;
    color?: 'text-brand-purple' | 'text-brand-green' | 'text-black';
    size?: 'lg' | 'xl' | 'md';
};

export const Number = ({ value, label, size, color = 'text-black' }: INumberProps) => {
    if (size === 'xl') {
        return (
            <div className="flex flex-col">
                <p>{label}</p>
                <p className={`text-3xl ${color}`}>{value}</p>
            </div>
        );
    } else if (size === 'lg') {
        return (
            <div className="flex flex-col">
                <p className="text-sm">{label}</p>
                <p className={`text-2xl ${color}`}>{value}</p>
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

import React from 'react';
import { PercentChangeDisplay } from './percent-change';

type INumberProps = {
    label?: string;
    value?: number | string | React.ReactNode;
    color?: 'text-brand-purple' | 'text-brand-green' | 'text-black' | 'text-white';
    size?: 'lg' | 'xl' | 'md';
    center?: boolean;
    change?: number;
};

export const NumberDisplay = ({
    value,
    label,
    size,
    color = 'text-black',
    center,
    change,
}: INumberProps) => {
    const labelSize = () => {
        switch (size) {
            case 'xl':
                return '';
            case 'lg':
                return 'text-sm';
            default:
                return 'text-sm';
        }
    };

    const valueSize = () => {
        switch (size) {
            case 'xl':
                return 'text-3xl';
            case 'lg':
                return 'text-2xl';
            default:
                return 'text-xl';
        }
    };

    return (
        <div className={`flex flex-col ${center ? 'text-center ' : ''}`}>
            <p className={`${labelSize()}`}>{label}</p>
            <p className={`${valueSize()} ${color}`}>{value}</p>
            {change && <PercentChangeDisplay value={change} />}
        </div>
    );
};

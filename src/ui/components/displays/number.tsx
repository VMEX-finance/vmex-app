import { Skeleton } from '@mui/material';
import React from 'react';
import { PercentChangeDisplay } from './percent-change';

type INumberProps = {
    label?: string;
    value?: number | string | React.ReactNode;
    color?: 'text-brand-purple' | 'text-brand-green' | 'text-black' | 'text-white' | string;
    size?: 'lg' | 'xl' | 'md';
    center?: boolean;
    change?: number;
    loading?: boolean;
};

export const NumberDisplay = ({
    value,
    label,
    size,
    color = 'text-black dark:text-neutral-100',
    center,
    change,
    loading,
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
                return { css: 'text-3xl', skeleton: '36px' };
            case 'lg':
                return { css: 'text-2xl', skeleton: '32px' };
            default:
                return { css: 'text-xl', skeleton: '28px' };
        }
    };

    return (
        <div className={`flex flex-col ${center ? 'text-center items-center' : ''}`}>
            <p className={`${labelSize()}`}>{label}</p>
            {loading ? (
                <Skeleton variant="rectangular" height={valueSize().skeleton} width={'60px'} />
            ) : (
                <p className={`${valueSize().css} ${color}`}>{value}</p>
            )}
            {/* TODO: calculate percentage changed */}
            {change && <PercentChangeDisplay value={change} />}
        </div>
    );
};

import React from 'react';
import { SkeletonLoader } from './loader-skeleton';
import { PercentChangeDisplay } from './display-percent-change';
import { SmartPrice } from './smart-price';

type INumberProps = {
    label?: string;
    value?: number | string | React.ReactNode;
    color?: 'text-brand-purple' | 'text-brand-green' | 'text-brand-black' | 'text-white' | string;
    size?: 'lg' | 'xl' | 'md';
    align?: 'left' | 'center' | 'right';
    change?: number;
    loading?: boolean;
    labelClass?: string;
};

export const NumberDisplay = ({
    value,
    label,
    size,
    color = 'text-brand-black dark:text-neutral-300',
    align,
    change,
    loading,
    labelClass,
}: INumberProps) => {
    const labelSize = () => {
        if (labelClass) return labelClass;
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
                return { css: 'text-3xl', skeletonHeight: '36px', skeletonWidth: '108px' };
            case 'lg':
                return { css: 'text-2xl', skeletonHeight: '32px', skeletonWidth: '64px' };
            default:
                return { css: 'text-xl', skeletonHeight: '28px', skeletonWidth: '56px' };
        }
    };

    const alignClass = () => {
        switch (align) {
            case 'center':
                return 'text-center items-center';
            case 'right':
                return 'text-right items-end';
            default:
                return '';
        }
    };

    return (
        <div className={`flex flex-col ${alignClass()}`}>
            <p className={`${labelSize()}`}>{label}</p>
            {loading ? (
                <SkeletonLoader
                    variant="rounded"
                    height={valueSize().skeletonHeight}
                    width={valueSize().skeletonWidth}
                />
            ) : (
                <span className={`${valueSize().css} ${color}`}>
                    {typeof value === 'string' ? <SmartPrice price={String(value)} /> : value}
                </span>
            )}
            {/* TODO: calculate percentage changed */}
            {change && <PercentChangeDisplay value={change} />}
        </div>
    );
};
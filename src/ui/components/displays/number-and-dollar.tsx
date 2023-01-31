import React from 'react';

type INumberAndDollarProps = {
    label?: string;
    value?: number | string | undefined;
    dollar?: number | string;
    color?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
};

export const NumberAndDollar = ({
    label,
    value,
    dollar,
    color,
    size = 'lg',
}: INumberAndDollarProps) => {
    const determineSize = () => {
        switch (size) {
            case 'xs':
                return ['text-md', 'text-xs'];
            case 'sm':
                return ['text-lg', 'text-xs'];
            case 'md':
                return ['text-xl', 'text-sm'];
            case 'lg':
                return ['text-2xl', 'text-sm'];
        }
    };

    return (
        <div
            className={`flex flex-col ${color ? color : 'text-brand-purple'} dark:text-neutral-300`}
        >
            {label && <span className="text-neutral-100">{label}</span>}
            <span className={`${determineSize()[0]} leading-4`}>{value || '0.0'}</span>
            {dollar && (
                <span
                    className={`${determineSize()[1]} leading-4 ${color ? 'text-neutral-500' : ''}`}
                >
                    {dollar || '0.00'}
                </span>
            )}
        </div>
    );
};

import React, { ReactNode } from 'react';

type ILabelProps = {
    children: string | ReactNode;
    color?: 'purple' | 'green' | 'pink' | 'blue';
    className?: string;
};

export const Label = ({ children, className = '', color = 'purple' }: ILabelProps) => {
    const renderClass = () => {
        let customClass = ``;
        if (color === 'blue' || children === 'Verified') {
            customClass = 'bg-gradient-to-r from-indigo-500 to-blue-400';
        } else if (color === 'green' || children === 'External') {
            customClass = 'bg-gradient-to-r from-green-500 to-emerald-500';
        } else if (color === 'pink') {
            customClass = 'bg-gradient-to-r from-rose-500 to-pink-400';
        } else {
            customClass = 'bg-gradient-to-r from-violet-500 to-purple-400';
        }
        return `px-2 py-1 text-xs text-neutral-100 sm:text-sm font-semibold rounded-lg text-center ${customClass} ${color} ${className}`;
    };
    return <span className={renderClass()}>{children}</span>;
};

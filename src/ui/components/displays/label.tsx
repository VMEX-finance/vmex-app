import React, { ReactNode } from 'react';

type ILabelProps = {
    children: string | ReactNode;
    color?: 'purple' | 'green' | 'pink' | 'blue';
};

export const Label = ({ children, color = 'purple' }: ILabelProps) => {
    const renderColor = () => {
        switch (color) {
            case 'blue':
                return 'bg-gradient-to-r from-indigo-500 to-blue-400';
            case 'green':
                return 'bg-gradient-to-r from-emerald-500 to-green-400';
            case 'pink':
                return 'bg-gradient-to-r from-rose-500 to-pink-400';
            default:
                return 'bg-gradient-to-r from-violet-500 to-purple-400';
        }
    };
    return (
        <span
            className={`px-2 py-1 text-xs text-neutral-100 sm:text-sm rounded-lg text-center ${renderColor()} ${color}`}
        >
            {children}
        </span>
    );
};

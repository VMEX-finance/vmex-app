import React from 'react';

type ICardProps = {
    children: React.ReactNode | React.ReactNode[];
    color?: string;
    black?: boolean;
    padding?: string;
    className?: string;
};

export const InnerCard = ({ children, color, black, padding, className }: ICardProps) => (
    <div
        className={`
          w-full rounded-lg shadow-inner bg-[#efefef] overflow-auto dark:bg-neutral-900
          ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100'}
          ${padding ? padding : 'p-3 lg:p-6'}
          ${className ? className : ''}
        `}
    >
        {children}
    </div>
);
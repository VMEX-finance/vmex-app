import React from 'react';

type ICardProps = {
    children: React.ReactNode | React.ReactNode[];
    color?: string;
    black?: boolean;
    padding?: string;
    className?: string;
};

export const Card = ({ children, color, black, padding, className }: ICardProps) => (
    <div
        className={`
    w-full rounded-lg shadow-lg overflow-auto
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-white'}
    ${padding ? padding : 'p-4 lg:p-8'}
    ${className ? className : ''}
  `}
    >
        {children}
    </div>
);

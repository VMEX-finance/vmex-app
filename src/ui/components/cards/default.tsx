import React from 'react';
import { SpinnerLoader } from '../loaders';

type ICardProps = {
    children: React.ReactNode | React.ReactNode[];
    color?: string;
    black?: boolean;
    padding?: string;
    className?: string;
    loading?: boolean;
};

export const Card = ({ children, color, black, padding, className, loading }: ICardProps) => (
    <div
        className={`dark:bg-black dark:text-neutral-100 dark:shadow-xl
    w-full rounded-lg shadow-lg overflow-auto
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-white'}
    ${padding ? padding : 'p-4 lg:p-8'}
    ${className ? className : ''}
  `}
    >
        {loading ? <SpinnerLoader /> : <>{children}</>}
    </div>
);

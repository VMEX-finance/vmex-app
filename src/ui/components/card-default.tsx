import React from 'react';
import { SpinnerLoader } from './loader-spinner';

type ICardProps = {
    children: React.ReactNode | React.ReactNode[];
    color?: string;
    black?: boolean;
    padding?: string;
    className?: string;
    loading?: boolean;
    title?: string;
    titleClass?: string;
    header?: React.ReactNode;
    loadingHeight?: string;
};

export const Card = ({
    children,
    color,
    black,
    padding,
    className,
    loading,
    title,
    titleClass,
    header,
    loadingHeight,
}: ICardProps) => (
    <div
        className={`dark:bg-brand-black dark:text-neutral-300 dark:shadow-xl
    w-full rounded-md shadow-md overflow-auto
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100'}
    ${padding ? padding : 'p-3 lg:p-4 xl:p-5 2xl:py-6'}
    ${className ? className : ''}
  `}
    >
        {header && header}
        {title && <h3 className={titleClass ? titleClass : 'text-2xl'}>{title}</h3>}
        {loading ? <SpinnerLoader height={loadingHeight} /> : <>{children}</>}
    </div>
);
import React from 'react';
import { Loader } from './loader';

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
    type?: 'inner' | 'default' | 'inner-outline';
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
    type = 'default',
}: ICardProps) => {
    if (type === 'inner-outline') {
        return (
            <div
                className={`
              w-full rounded-lg shadow-inner bg-[#efefef] overflow-auto dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 dark:shadow-black
              ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100'}
              ${padding ? padding : 'px-3 py-1.5'}
              ${className ? className : ''}
            `}
            >
                {children}
            </div>
        );
    }
    if (type === 'inner') {
        return (
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
    }
    return (
        <div
            className={`dark:bg-brand-black dark:text-neutral-300
    w-full rounded-md shadow-md shadow-gray-300 dark:shadow-neutral-950
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-white'}
    ${padding ? padding : 'p-3 lg:p-4 xl:p-4 2xl:py-5 2xl:px-6'}
    ${className ? className : ''}
  `}
        >
            {header && header}
            {title && <h3 className={titleClass ? titleClass : 'text-2xl'}>{title}</h3>}
            {loading ? <Loader type="spinner" height={loadingHeight} /> : <>{children}</>}
        </div>
    );
};

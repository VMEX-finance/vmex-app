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
    type?: 'inner' | 'default';
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
    w-full rounded-md shadow-md shadow-gray-300 dark:shadow-neutral-950 overflow-auto
<<<<<<< HEAD
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-white'}
=======
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-100'}
>>>>>>> origin
    ${padding ? padding : 'p-3 lg:p-4 xl:p-5 2xl:py-6'}
    ${className ? className : ''}
  `}
        >
            {header && header}
            {title && <h3 className={titleClass ? titleClass : 'text-2xl'}>{title}</h3>}
            {loading ? <Loader type="spinner" height={loadingHeight} /> : <>{children}</>}
        </div>
    );
};

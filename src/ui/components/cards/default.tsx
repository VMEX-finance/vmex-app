import React from 'react';
import { CgSpinner } from 'react-icons/cg';

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
        className={`
    w-full rounded-lg shadow-lg overflow-auto
    ${color ? color : black ? 'bg-neutral-900 text-neutral-100' : 'bg-white'}
    ${padding ? padding : 'p-4 lg:p-8'}
    ${className ? className : ''}
  `}
    >
        {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
                <CgSpinner className="animate-spin" size="36px" />
            </div>
        ) : (
            <>{children}</>
        )}
    </div>
);

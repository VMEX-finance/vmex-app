import React, { ReactNode } from 'react';

type ISecondaryButtonProps = {
    children: string | ReactNode;
    onClick: any;
    loading?: boolean;
    className?: string;
    disabled?: boolean;
};

export const SecondaryButton = ({
    children,
    onClick,
    loading,
    className,
    disabled,
}: ISecondaryButtonProps) => {
    return (
        <button
            className={`text-xs text-right text-blue-700 dark:text-brand-blue dark:hover:text-blue-500 hover:text-brand-purple transition duration-150 ${
                loading ? 'animate-pulse' : ''
            } ${className ? className : ''}`}
            onClick={onClick}
            disabled
        >
            {children}
        </button>
    );
};

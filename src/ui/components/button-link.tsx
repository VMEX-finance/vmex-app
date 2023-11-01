import React from 'react';

type ILinkButtonProps = {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode | string;
    className?: string;
    disabled?: boolean;
    underline?: boolean;
    highlight?: boolean;
};

export const LinkButton = ({
    onClick,
    children,
    className,
    disabled,
    underline,
    highlight,
}: ILinkButtonProps) => {
    return (
        <button
            className={`
        ${className} 
        ${underline ? 'underline' : ''} 
        ${
            highlight
                ? 'text-brand-purple hover:!text-brand-purple dark:!text-brand-blue dark:hover:!text-blue-400'
                : ''
        }
        flex items-center hover:cursor-pointer hover:text-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-300 transition duration-100
      `}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

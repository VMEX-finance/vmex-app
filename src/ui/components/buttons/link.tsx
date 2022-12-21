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
                ? 'text-brand-purple hover:!text-brand-purple dark:text-brand-blue dark:hover:!text-brand-blue'
                : ''
        }
        flex items-center hover:cursor-pointer hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300 transition duration-150
      `}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

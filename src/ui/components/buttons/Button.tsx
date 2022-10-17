import React from 'react';

export interface IButtonProps {
    label: string | React.ReactNode;
    primary?: boolean;
    onClick?: (e: any) => void;
    border?: boolean | string;
    className?: string;
    disabled?: boolean;
}

export const Button = ({
    label,
    onClick,
    primary,
    border = true,
    className,
    disabled,
}: IButtonProps) => {
    const mode = primary
        ? 'bg-black rounded-lg text-white hover:bg-neutral-800 border border-[1px] border-black'
        : border
        ? `bg-white text-neutral-900 border-[1px] border-black border-solid rounded-lg hover:bg-neutral-800 hover:text-white`
        : 'bg-white text-neutral-900 rounded-lg hover:bg-neutral-200';
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={[
                'box-border',
                'font-basefont',
                'px-4 py-1',
                'transition duration-200',
                className,
                mode,
                `${disabled ? 'hover:!bg-inherit !cursor-not-allowed' : ''}`,
            ].join(' ')}
        >
            {label}
        </button>
    );
};

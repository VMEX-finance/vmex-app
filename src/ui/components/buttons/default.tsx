import React from 'react';
import { CgSpinner } from 'react-icons/cg';

export interface IButtonProps {
    label?: string | React.ReactNode;
    primary?: boolean;
    onClick?: (e: any) => void;
    border?: boolean | string;
    className?: string;
    disabled?: boolean;
    type?: 'delete';
    icon?: React.ReactNode;
    loading?: boolean;
}

export const Button = ({
    label,
    onClick,
    primary,
    border = true,
    className,
    disabled,
    type,
    icon,
    loading,
}: IButtonProps) => {
    const mode = primary
        ? 'bg-black rounded-lg text-white hover:bg-neutral-800 border border-[1px] border-black'
        : border
        ? `bg-white text-neutral-900 border-[1px] border-black border-solid rounded-lg hover:bg-neutral-100`
        : 'bg-white text-neutral-900 rounded-lg hover:bg-neutral-200';

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={[
                `${
                    primary
                        ? 'dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
                        : 'dark:bg-black dark:text-neutral-100 dark:hover:bg-neutral-900'
                } ${disabled ? 'dark:border-transparent' : 'dark:border-neutral-100'}`,
                'h-fit',
                'box-border',
                'font-basefont',
                `${typeof label === 'string' ? 'px-4' : 'px-2'} py-1`,
                'transition duration-200',
                `${
                    type === 'delete'
                        ? '!bg-red-600 !text-white !border-red-600 hover:!bg-red-500 hover:!border-red-500 disabled:!text-white'
                        : ''
                }`,
                className,
                mode,
                `${
                    disabled
                        ? `${
                              primary
                                  ? '!bg-neutral-700 dark:!bg-neutral-400 !text-neutral-300 dark:!text-neutral-800'
                                  : 'hover:!bg-inherit hover:!text-inherit'
                          } !cursor-not-allowed`
                        : ''
                }`,
            ].join(' ')}
        >
            <span className="flex items-center gap-2">
                {label || 'Submit'}
                {loading ? <CgSpinner className="animate-spin" /> : icon}
            </span>
        </button>
    );
};

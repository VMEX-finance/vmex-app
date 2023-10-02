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
    loadingText?: string;
    size?: 'sm' | 'lg';
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
    loadingText,
    size,
}: IButtonProps) => {
    const mode = primary
        ? 'bg-brand-black rounded-lg text-neutral-200 hover:bg-neutral-800 border border-[1px] border-brand-black'
        : border
        ? `bg-white text-neutral-900 border-[1px] border-brand-black border-solid rounded-lg hover:bg-neutral-100`
        : 'bg-white text-neutral-900 rounded-lg hover:bg-neutral-200';

    const determineSize = () => {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-md';
        }
    };

    return (
        <button
            disabled={disabled || loading}
            onClick={onClick}
            className={[
                `${
                    primary
                        ? 'dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300'
                        : 'dark:bg-brand-black dark:text-neutral-200 dark:hover:bg-neutral-900'
                } ${disabled || loading ? 'dark:border-transparent' : 'dark:border-neutral-200'}`,
                'h-fit',
                determineSize(),
                'box-border',
                'font-basefont',
                `${typeof label === 'string' ? 'px-4' : 'px-2'} py-1`,
                'transition duration-150',
                `${
                    type === 'delete'
                        ? '!bg-red-600 !text-white !border-red-600 hover:!bg-red-500 hover:!border-red-500 disabled:!text-white'
                        : ''
                }`,
                className,
                mode,
                `${
                    disabled || loading
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
                {loading ? (loadingText ? loadingText : 'Loading') : label || 'Submit'}
                {loading ? <CgSpinner className="animate-spin" /> : icon}
            </span>
        </button>
    );
};

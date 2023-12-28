import { useWindowSize } from '@/hooks';
import { isChainUnsupported } from '@/utils';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import React from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useAccount } from 'wagmi';

export type IButtonProps = {
    children?: string | React.ReactNode;
    onClick?: (
        e: any,
    ) => void | Promise<void> | (() => Promise<void>) | ((e: any) => Promise<void>);
    className?: string;
    disabled?: boolean;
    type?: 'danger' | 'link' | 'default' | 'accent' | 'outline' | 'selected' | 'accent-strong';
    icon?: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
    size?: 'sm' | 'lg' | 'md';
    underline?: boolean;
    padding?: `p${string}`;
    web3?: boolean;
    left?: {
        text: string;
        onClick: any;
        disabled?: boolean;
    };
    right?: {
        text: string;
        onClick: any;
        disabled?: boolean;
    };
    highlight?: boolean;
};

export const Button = ({
    children,
    onClick,
    className,
    disabled,
    type = 'default',
    icon,
    loading,
    loadingText,
    size,
    underline,
    padding,
    web3,
    left,
    right,
    highlight,
}: IButtonProps) => {
    const { address } = useAccount();
    const { width, breakpoints } = useWindowSize();
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    // CSS
    const baseClass =
        'flex items-center justify-center gap-0.5 font-basefont cursor-pointer disabled:cursor-not-allowed disabled:opacity-70';
    const borderClass = 'border border-transparent';
    const shadowClass = 'shadow shadow-sm hover:shadow-none dark:shadow-black';
    const transitionClass = 'transition duration-150';
    const underlineClass = underline ? 'underline' : '';
    const paddingClass = padding ? padding : 'px-3 py-1';
    const highlightedClass = highlight ? '!text-brand-purple' : '';
    const roundingClass = 'rounded-lg';

    function renderSize() {
        switch (size) {
            case 'sm':
                return 'text-sm';
            case 'lg':
                return 'text-lg';
            default:
                return 'text-md';
        }
    }

    function renderCustomClass() {
        switch (type) {
            case 'danger':
                return '!bg-red-600 !text-white !border-red-600 hover:!bg-red-500 hover:!border-red-500 disabled:!text-white';
            case 'selected':
                return 'text-black dark:text-neutral-100 hover:text-indigo-500 !shadow-none !p-0';
            case 'link':
                return 'text-brand-purple hover:text-indigo-500 !shadow-none !p-0';
            case 'outline':
                return '!border-gray-500 dark:!border-gray-500 dark:text-white hover:bg-gray-100  dark:hover:bg-neutral-800';
            case 'accent':
                return 'hover:bg-indigo-200 bg-[rgb(214,222,255)] disabled:!bg-[rgb(214,222,255)] dark:text-neutral-900 dark:bg-indigo-300 dark:disabled:!bg-indigo-300 dark:hover:bg-indigo-200 dark:disabled:text-neutral-700';
            case 'accent-strong':
                return 'hover:bg-indigo-200 bg-[rgb(214,222,255)] disabled:!bg-[rgb(214,222,255)] dark:text-neutral-900 dark:bg-indigo-300 dark:disabled:!bg-indigo-300 dark:hover:bg-indigo-200 dark:disabled:text-neutral-700';
            default:
                return 'bg-gray-300 hover:bg-[rgb(199,207,219)] dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white disabled:bg-gray-300 dark:disabled:bg-neutral-800 disabled:shadow-none';
        }
    }

    // Render text and clicks
    function renderButtonText() {
        if (web3) {
            if (!address) return width > breakpoints.md ? 'Connect Wallet' : 'Connect';
            if (isChainUnsupported()) return 'Switch Networks';
            return children;
        }
        if (loadingText && loading) return loadingText;
        if (children) return children;
        return 'Submit';
    }

    function renderClick() {
        if (web3) {
            if (!address && openConnectModal) () => openConnectModal();
            if (isChainUnsupported() && openChainModal) () => openChainModal();
            return onClick;
        }
        return onClick;
    }

    // Split buttons
    if (left && right) {
        const classes = [
            baseClass,
            renderSize(),
            renderCustomClass(),
            className,
            underlineClass,
            paddingClass,
            shadowClass,
            transitionClass,
        ];

        return (
            <div className={['grid grid-cols-2 min-w-[150px]', roundingClass].join(' ')}>
                <button
                    type="button"
                    disabled={left?.disabled || loading}
                    onClick={left?.onClick}
                    className={[
                        ...classes,
                        'rounded-l-lg',
                        'border-r border-white dark:border-brand-black',
                    ].join(' ')}
                >
                    {left?.text}
                </button>
                <button
                    type="button"
                    disabled={right?.disabled || loading}
                    onClick={right?.onClick}
                    className={[
                        ...classes,
                        'rounded-r-lg',
                        'border-l border-white dark:border-brand-black',
                    ].join(' ')}
                >
                    {right?.text}
                </button>
            </div>
        );
    }

    // Other buttons
    return (
        <button
            type="button"
            disabled={disabled || loading}
            onClick={renderClick()}
            className={[
                baseClass,
                renderSize(),
                renderCustomClass(),
                className,
                underlineClass,
                paddingClass,
                roundingClass,
                shadowClass,
                transitionClass,
                borderClass,
                highlightedClass,
            ].join(' ')}
        >
            {renderButtonText()}
            {icon && icon}
            {loading && <CgSpinner className="animate-spin" />}
        </button>
    );
};

import { useWindowSize } from '@/hooks';
import { useThemeContext } from '@/store';
import { truncate } from '@/utils';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import React from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';

export type IButtonProps = {
    children?: string | React.ReactNode;
    onClick?: (e: any) => void | { left: (e: any) => void; right: (e: any) => void };
    className?: string;
    disabled?: boolean;
    type?: 'danger' | 'link' | 'default' | 'accent' | 'outline';
    icon?: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
    size?: 'sm' | 'lg' | 'md';
    underline?: boolean;
    padding?: `p${string}`;
    web3?: boolean;
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
}: IButtonProps) => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { width, breakpoints } = useWindowSize();
    const navigate = useNavigate();
    const { openConnectModal } = useConnectModal();
    const { switchNetwork } = useSwitchNetwork();

    // CSS
    const baseClass =
        'flex items-center justify-center gap-1 font-basefont cursor-pointer disabled:cursor-not-allowed';
    const borderClass = 'border border-transparent';
    const shadowClass = 'shadow shadow-sm hover:shadow-none dark:shadow-black';
    const transitionClass = 'transition duration-150';
    const underlineClass = underline ? 'underline' : '';
    const paddingClass = padding ? padding : 'px-3 py-1';
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
            case 'link':
                return 'text-brand-purple hover:text-indigo-500 !shadow-none';
            case 'outline':
                return '!border-gray-500 dark:!border-gray-500 dark:text-white hover:bg-gray-100  dark:hover:bg-neutral-800';
            case 'accent':
                return 'hover:bg-indigo-200 bg-[rgb(214,222,255)] dark:text-neutral-900 dark:bg-indigo-300 dark:hover:bg-indigo-200';
            default:
                return 'bg-gray-300 hover:bg-[rgb(199,207,219)] dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white';
        }
    }

    // Render text and clicks
    function renderButtonText() {
        if (web3) {
            if (!address) return width > breakpoints.md ? 'Connect Wallet' : 'Connect';
            if (chain?.unsupported) return 'Switch Networks';
            return children;
        }
        if (loadingText && loading) return loadingText;
        if (children) return children;
        return 'Submit';
    }

    function renderClick() {
        if (web3) {
            if (!address && openConnectModal) () => openConnectModal();
            if (chain?.unsupported && switchNetwork) () => switchNetwork();
            return onClick;
        }
        return onClick;
    }

    // Split buttons
    if ((onClick as any)?.left) {
        const _onClick = onClick as any;
        const _children = children as any;
        return (
            <div className={['grid grid-cols-2 divide-x-2', roundingClass].join(' ')}>
                <button
                    type="button"
                    disabled={disabled || loading}
                    onClick={_onClick.left}
                    className={[
                        baseClass,
                        renderSize(),
                        renderCustomClass(),
                        className,
                        underlineClass,
                        paddingClass,
                        shadowClass,
                        transitionClass,
                        borderClass,
                    ].join(' ')}
                >
                    {_children.left}
                </button>
                <button
                    type="button"
                    disabled={disabled || loading}
                    onClick={_onClick.right}
                    className={[
                        baseClass,
                        renderSize(),
                        renderCustomClass(),
                        className,
                        underlineClass,
                        paddingClass,
                        shadowClass,
                        transitionClass,
                        borderClass,
                    ].join(' ')}
                >
                    {_children.left}
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
            ].join(' ')}
        >
            {loading && <CgSpinner className="animate-spin" />}
            {renderButtonText()}
            {icon && icon}
        </button>
    );
};

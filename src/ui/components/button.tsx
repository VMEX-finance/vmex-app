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
    type?: 'danger' | 'link' | 'primary' | 'secondary' | 'wallet' | 'outline';
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
    type = 'primary',
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
    const { isDark } = useThemeContext();
    const { width, breakpoints } = useWindowSize();
    const navigate = useNavigate();
    const { disconnect } = useDisconnect();
    const { openConnectModal } = useConnectModal();
    const { switchNetwork } = useSwitchNetwork();

    // CSS
    const baseClass =
        'flex items-center gap-1 transition duration-150 cursor-pointer disabled:cursor-not-allowed border';
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
                return 'text-sm';
        }
    }

    function renderCustomClass() {
        switch (type) {
            case 'danger':
                return '!bg-red-600 !text-white !border-red-600 hover:!bg-red-500 hover:!border-red-500 disabled:!text-white';
            case 'link':
                return 'text-brand-purple hover:text-indigo-500';
            case 'outline':
                return '';
            case 'wallet':
                return '';
            case 'secondary':
                return '';
            default:
                return '';
        }
    }

    // Render text and clicks
    function renderButtonText() {
        if (web3 || type === 'wallet') {
            if (!address) return width > breakpoints.md ? 'Connect Wallet' : 'Connect';
            if (chain?.unsupported) return 'Switch Networks';
            return children;
        }
        if (loadingText && loading) return loadingText;
        if (children) return children;
        return 'Submit';
    }

    function renderClick() {
        if (web3 || type === 'wallet') {
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
                    ].join(' ')}
                >
                    {_children.left}
                </button>
            </div>
        );
    }

    // Wallet button
    if (type === 'wallet') {
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
                ].join(' ')}
            >
                {loading && <CgSpinner className="animate-spin" />}
                {address ? truncate(address) : renderButtonText()}
                {icon && icon}
            </button>
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
            ].join(' ')}
        >
            {loading && <CgSpinner className="animate-spin" />}
            {renderButtonText()}
            {icon && icon}
        </button>
    );
};

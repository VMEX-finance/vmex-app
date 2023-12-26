import React, { ReactNode } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { useThemeContext } from '@/store';
import { Transition } from '@headlessui/react';
import { Skeleton } from '@mui/material';
import { ProgressBar } from './progress';

type ILoaderProps = {
    type?: 'spinner' | 'skeleton' | 'full-page';
    loading?: boolean | { slow: boolean; fast: boolean };
    text?: string;
    onlyHome?: boolean;
    children?: ReactNode;
    animation?: boolean | 'pulse' | 'wave';
    variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
    height?: string | number | 'auto';
    width?: string | number;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    className?: string;
};

export const Loader = ({
    type = 'skeleton',
    loading,
    text,
    onlyHome,
    children,
    animation,
    variant,
    height,
    width,
    size,
    className,
}: ILoaderProps) => {
    const { isDark } = useThemeContext();

    if (type === 'spinner') {
        const determineSize = () => {
            switch (size) {
                case 'lg':
                    return '48px';
                case 'sm':
                    return '24px';
                case 'xs':
                    return '18px';
                default:
                    return '36px';
            }
        };

        return (
            <div
                className={`flex justify-center items-center ${height ? height : 'min-h-[200px]'} ${
                    width ? width : ''
                }`}
            >
                <CgSpinner className="animate-spin" size={determineSize()} />
            </div>
        );
    }

    if (type === 'full-page') {
        return (
            <>
                <Transition
                    show={typeof loading === 'boolean' ? loading : loading?.slow}
                    leave="transition-opacity duration-400"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="top-0 left-0 h-screen w-full bg-white dark:bg-neutral-900 z-[9999] fixed">
                        <Transition
                            className={`flex flex-col justify-center items-center h-full ${
                                animation ? 'animate-pulse' : ''
                            }`}
                            show={typeof loading === 'boolean' ? loading : loading?.fast}
                            enter="transition-opacity duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100 "
                            leave="transition-opacity duration-400"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <img
                                src="/3D-logo.svg"
                                alt="VMEX Logo"
                                width="150"
                                height="150"
                                rel="preload"
                            />
                            <p className="text-center font-medium dark:text-neutral-300 mt-4 tracking-wide">
                                {text}
                            </p>
                            <div className="w-60 mx-auto mt-2">
                                <ProgressBar />
                            </div>
                        </Transition>
                    </div>
                </Transition>
                {children}
            </>
        );
    }

    if (
        typeof loading !== 'undefined' &&
        typeof loading === 'boolean' &&
        loading === false &&
        children
    ) {
        return <>{children}</>;
    }

    return (
        <Skeleton
            variant={variant}
            height={height}
            width={width}
            animation={animation as 'pulse' | 'wave'}
            className={className}
            sx={{ bgcolor: isDark ? 'grey.900' : 'grey.300' }}
        >
            {children}
        </Skeleton>
    );
};

import { Transition } from '@headlessui/react';
import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMarketsData, useProtocolData, useTranchesData } from '../../../api';

type IFullPageLoader = {
    loading?: boolean;
    text?: string;
    onlyHome?: boolean;
    children: ReactNode;
};

export const FullPageLoader = ({
    loading = true,
    text = 'Loading VMEX Finance...',
    onlyHome,
    children,
}: IFullPageLoader) => {
    const { pathname } = useLocation();
    useProtocolData();
    useTranchesData();
    useMarketsData();

    const determineShow = () => {
        if (onlyHome) {
            return loading && (pathname === '/' || pathname === '/overview');
        } else {
            return loading;
        }
    };

    useEffect(() => {
        if (document) {
            if (loading && (pathname === '/' || pathname === '/overview')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    }, [loading]);

    return (
        <>
            <Transition
                show={determineShow()}
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="absolute top-0 left-0 h-screen w-full bg-[#eee] dark:bg-neutral-900 z-[9999]">
                    <div className="flex flex-col gap-5 justify-center items-center h-full animate-pulse">
                        <img src="/VMEX-logo-only.png" alt="VMEX Logo" width="165" height="150" />
                        {text && (
                            <p className="text-center font-medium dark:text-neutral-100">{text}</p>
                        )}
                    </div>
                </div>
            </Transition>
            {children}
        </>
    );
};

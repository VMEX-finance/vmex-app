import { Transition } from '@headlessui/react';
import React, { ReactNode } from 'react';
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

    return (
        <div className={`${determineShow() ? '!overflow-hidden' : ''}`}>
            <Transition
                show={determineShow()}
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="absolute top-0 left-0 h-screen w-full bg-[#eee] z-[9999]">
                    <div className="flex flex-col gap-5 justify-center items-center h-full animate-pulse">
                        <img src="/VMEX-logo-only.png" alt="VMEX Logo" width="165" height="150" />
                        {text && <p className="text-center font-medium">{text}</p>}
                    </div>
                </div>
            </Transition>
            {children}
        </div>
    );
};

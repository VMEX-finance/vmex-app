import { useSubgraphTranchesOverviewData } from '../../../api';
import { Transition } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type IFullPageLoader = {
    loading?: boolean;
    text?: string;
    onlyHome?: boolean;
    children: ReactNode;
    animation?: boolean;
};

export const FullPageLoader = ({
    loading = true,
    text = 'VMEX Finance',
    onlyHome,
    children,
    animation,
}: IFullPageLoader) => {
    useSubgraphTranchesOverviewData();

    const { pathname } = useLocation();

    const determineShow = () => {
        if (onlyHome) {
            return loading && (pathname === '/' || pathname === '/overview');
        } else {
            return loading;
        }
    };

    return (
        <>
            <Transition
                show={determineShow()}
                leave="transition-opacity duration-1000"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="top-0 left-0 h-screen w-full bg-[#eee] dark:bg-neutral-900 z-[9999] fixed">
                    <div
                        className={`flex flex-col gap-5 justify-center items-center h-full ${
                            animation ? 'animate-pulse' : ''
                        }`}
                    >
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

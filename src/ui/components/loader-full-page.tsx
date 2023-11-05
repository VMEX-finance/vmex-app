import { Transition } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalContext } from '@/store';

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
    const { pathname } = useLocation();
    const { firstLoad } = useGlobalContext();

    const determineShow = () => {
        if (onlyHome) {
            return loading && (pathname === '/' || pathname === '/overview') && !firstLoad;
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
                    <Transition
                        className={`flex flex-col justify-center items-center h-full ${
                            animation ? 'animate-pulse' : ''
                        }`}
                        show={determineShow()}
                        leave="transition-opacity duration-800"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <img
                            src="/3D-logo.svg"
                            alt="VMEX Logo"
                            width="165"
                            height="150"
                            rel="preload"
                        />
                        <p className="text-center font-medium dark:text-neutral-300 mt-6">{text}</p>
                    </Transition>
                </div>
            </Transition>
            {children}
        </>
    );
};
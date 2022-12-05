import { Transition } from '@headlessui/react';
import React from 'react';
import { useMarketsData, useProtocolData, useTranchesData } from '../../../api';

type IFullPageLoader = {
    loading?: boolean;
    text?: string;
};

export const FullPageLoader = ({
    loading = true,
    text = 'Loading VMEX Finance...',
}: IFullPageLoader) => {
    useProtocolData();
    useTranchesData();
    useMarketsData();

    return (
        <Transition
            show={loading}
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="h-screen w-screen flex flex-col gap-5 justify-center items-center animate-pulse">
                <img src="/VMEX-logo-only.png" alt="VMEX Logo" width="165" height="150" />
                {text && <p className="text-center font-medium">{text}</p>}
            </div>
        </Transition>
    );
};

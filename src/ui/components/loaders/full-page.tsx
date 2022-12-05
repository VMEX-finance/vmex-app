import React from 'react';
import { useMarketsData, useProtocolData, useTranchesData, useUserData } from '../../../api';

export const FullPageLoader = () => {
    const { queryProtocolOverview } = useProtocolData();
    useTranchesData();
    useMarketsData();

    console.log(queryProtocolOverview);

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="animate-pulse">
                <img src="/VMEX-logo-only.png" alt="VMEX Logo" />
            </div>
        </div>
    );
};

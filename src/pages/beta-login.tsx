import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useGlobalContext } from '../store/global';

const BetaLogin: React.FC = () => {
    const { address } = useAccount();
    const { currentNetwork } = useGlobalContext();
    return (
        <div className="flex flex-col gap-6 justify-center items-center h-screen w-screen text-center">
            <div className="flex flex-col text-center justify-center items-center">
                <img src="/3D-logo.svg" alt="VMEX Logo" width="165" height="150" rel="preload" />
                <p className="text-center font-medium mt-6">VMEX Finance</p>
                <p className="text-sm font-light">{currentNetwork.toUpperCase()}</p>
                <p className="text-center font-medium">Beta</p>
            </div>
            <ConnectButton showBalance={false} />
            {/* {!isAuthenticated && address && (
                <span className="text-red-600">
                    You are not on the beta whitelist. Please contact an administrator to be added.
                </span>
            )} */}
        </div>
    );
};
export default BetaLogin;

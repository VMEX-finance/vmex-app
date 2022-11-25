import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useEffect } from 'react';
import { useWalletState2 } from '../../../hooks/wallet';
import { IButtonProps } from './default';
import { useConnect } from 'wagmi';

export const RainbowWalletButton = () => {
    return <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />;
};

/* export const RainbowWalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
   const { connectRainbow } = useWalletState2();
    const { status } = useConnect();
    useEffect(() => {
        status == 'success' && connectRainbow()
    },[status])

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');
                return (
                    <div className={['bg-black', 'rounded-lg', 'text-white', 'hover:bg-neutral-800', 'border', 'border-[1px]', 'border-black', className].join(' ')}
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button">
                                        Connect Wallet
                                    </button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        onClick={openChainModal}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        type="button"
                                    >
        
                                    </button>
                                    <button onClick={openAccountModal} type="button">
                                        {account.displayName}

                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
 */

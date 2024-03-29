import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useContext, useEffect } from 'react';
import { IButtonProps } from './button';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { useWindowSize, useDialogController } from '@/hooks';
import { DefaultDropdown, IDropdownItemProps } from './dropdown';
import { truncateAddress, truncate, isChainUnsupported } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSubgraphUserData } from '@/api';
import { ThemeContext } from '@/store';

export const WalletButton = ({ className, children = 'Connect Wallet' }: IButtonProps) => {
    const { chain } = useNetwork();
    const navigate = useNavigate();
    const { disconnect } = useDisconnect();
    const { isDark } = useContext(ThemeContext); // TODO make a context hook for this
    const { openDialog } = useDialogController();
    const { width } = useWindowSize();
    const { address } = useAccount();
    const title = address ? truncateAddress(address) : children;
    const mode = `transition duration-100 bg-neutral-300 shadow-sm hover:shadow-none text-brand-black hover:bg-[rgb(200,200,200)]`;
    const queryClient = useQueryClient();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');

    const renderDropdownItems = () => {
        let final: IDropdownItemProps[] = [
            {
                text: 'Referrals',
                onClick: () => openDialog('referrals-dialog'),
            },
            {
                text: 'TX History',
                onClick: () => openDialog('transactions-dialog'),
            },
            // WEN: uncomment when backend enables creating tranches
            // {
            //     text: 'Create Tranche',
            //     onClick: () => openDialog('create-tranche-dialog'),
            // },
        ];

        if (queryTrancheAdminData?.data && queryTrancheAdminData?.data?.length !== 0) {
            final.push({
                text: 'My Tranches',
                onClick: () => navigate('/my-tranches'),
            });
        }

        if (address) {
            final.push({
                text: 'Disconnect',
                onClick: () => disconnect(),
                className: 'text-red-600',
            });
        }

        return final;
    };

    // Refetch queries on account switch
    useEffect(() => {
        if (window.ethereum) {
            (window.ethereum as any).on('accountsChanged', (accounts: Array<string>) => {
                queryClient.invalidateQueries();
            });
        }
    }, [address, queryClient]);

    if (address && width > 1024 && !isChainUnsupported()) {
        return (
            <DefaultDropdown
                className={['', mode, className].join(' ')}
                selected={width > 1400 ? truncateAddress(address) : truncate(address, 3)}
                items={renderDropdownItems()}
                size="lg"
            />
        );
    } else {
        return (
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openConnectModal,
                    openChainModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus || authenticationStatus === 'authenticated');

                    const determineConnection = () => {
                        if (!connected) {
                            return { onClick: openConnectModal, render: title };
                        } else if (chain.unsupported) {
                            return { onClick: openChainModal, render: 'Switch Network' };
                        } else {
                            return { onClick: openAccountModal, render: account.displayName };
                        }
                    };

                    return (
                        <div
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
                                return (
                                    <button
                                        onClick={determineConnection().onClick}
                                        type="button"
                                        className={[
                                            'h-fit w-full',
                                            'box-border',
                                            'font-basefont',
                                            `${
                                                typeof children === 'string' ? 'px-4' : 'px-2'
                                            } py-1`,
                                            'transition duration-200',
                                            'py-1.5',
                                            mode,
                                            className,
                                            'bg-brand-black dark:bg-neutral-800 rounded-lg text-neutral-900 dark:text-white dark:border-transparent dark:hover:bg-neutral-700',
                                        ].join(' ')}
                                    >
                                        {determineConnection().render}
                                    </button>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        );
    }
};

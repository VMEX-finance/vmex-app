import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useContext, useEffect } from 'react';
import { IButtonProps } from './default';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { ThemeContext } from '../../../store';
import { useWindowSize, useDialogController } from '../../../hooks';
import { DefaultDropdown, IDropdownItemProps } from '../dropdowns';
import { truncateAddress, truncate } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSubgraphUserData } from '../../../api';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const navigate = useNavigate();
    const { disconnect } = useDisconnect();
    const { theme, setTheme } = useContext(ThemeContext);
    const { openDialog } = useDialogController();
    const { width } = useWindowSize();
    const { address } = useAccount();
    const title = address ? truncateAddress(address) : label;
    const mode = `transition duration-150 ${
        primary && !address ? '' : 'bg-white text-brand-black hover:bg-neutral-100'
    }`;
    const queryClient = useQueryClient();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');

    const renderDropdownItems = () => {
        let final: IDropdownItemProps[] = [
            {
                text: theme === 'light' ? 'Dark Mode' : 'Light Mode',
                onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'),
            },
            {
                text: 'My Portfolio',
                onClick: () => navigate('/portfolio'),
            },
            {
                text: 'Create Tranche',
                onClick: () => openDialog('create-tranche-dialog'),
            },
        ];

        if (queryTrancheAdminData?.data?.length !== 0) {
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

    if (address && width > 1024 && !chain?.unsupported) {
        return (
            <DefaultDropdown
                className={[
                    'min-h-[36px] border-1 border border-brand-black',
                    mode,
                    className,
                ].join(' ')}
                selected={width > 1400 ? truncateAddress(address) : truncate(address, 3)}
                items={renderDropdownItems()}
                size="lg"
                wrapperClass="mt-0"
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
                            return { onClick: () => switchNetwork?.(5), render: 'Wrong Network' };
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
                                            `${typeof label === 'string' ? 'px-4' : 'px-2'} py-1`,
                                            'transition duration-200',
                                            'min-h-[36px] !py-2',
                                            mode,
                                            className,
                                            'bg-brand-black dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300 rounded-lg text-neutral-100 hover:bg-neutral-800 border border-brand-black',
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

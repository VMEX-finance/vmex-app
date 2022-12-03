import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { IButtonProps } from './default';
import { useAccount } from 'wagmi';
import { useDialogController } from '../../../hooks/dialogs';
import { useMyTranchesContext } from '../../../store/contexts';
import { useWindowSize } from '../../../hooks/ui';
import { DropdownButton } from './dropdown';
import { truncateAddress, truncate } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const navigate = useNavigate();
    const { openDialog } = useDialogController();
    const { width } = useWindowSize();
    const { myTranches } = useMyTranchesContext();
    const { address } = useAccount();
    const title = address ? truncateAddress(address) : label;
    const mode = `transition duration-150 ${
        primary && !address ? '' : '!bg-white !text-black hover:!bg-neutral-100'
    }`;

    const renderDropdownItems = () => {
        let final = [
            {
                text: 'My Portfolio',
                onClick: () => navigate('/portfolio'),
            },
            {
                text: 'Create Tranche',
                onClick: () => openDialog('create-tranche-dialog'),
            },
        ];

        if (myTranches.length !== 0) {
            final.push({
                text: 'My Tranches',
                onClick: () => openDialog('my-tranches-dialog'),
            });
        }

        return final;
    };

    if (address && width > 1024) {
        return (
            <DropdownButton
                className={['min-h-[36px] border-1 border border-black', mode, className].join(' ')}
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
                    openChainModal,
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
                            return { onClick: openChainModal, render: 'Wrong Network' };
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
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={determineConnection().onClick}
                                            type="button"
                                            className={[
                                                'h-fit w-full',
                                                'box-border',
                                                'font-basefont',
                                                `${
                                                    typeof label === 'string' ? 'px-4' : 'px-2'
                                                } py-1`,
                                                'transition duration-200',
                                                'min-h-[36px] !py-2 mt-1',
                                                mode,
                                                className,
                                                'bg-black rounded-lg text-white hover:bg-neutral-800 border border-black',
                                            ].join(' ')}
                                        >
                                            {determineConnection().render}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        );
    }
};

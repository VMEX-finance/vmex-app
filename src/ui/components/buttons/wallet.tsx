import React from 'react';
import { useWalletState } from '../../../hooks/wallet';
import { Button, IButtonProps } from './default';
import { truncateAddress } from '../../../utils/helpers';
import { useWindowSize } from '../../../hooks/ui';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const _label = label;
    const { address, connectMetamask, connectWeb3Wallet } = useWalletState();
    const { width } = useWindowSize();

    const mode = primary && !address ? '' : '!bg-white !text-black hover:!bg-neutral-200';
    return (
        <Button
            primary
            onClick={width > 1024 ? connectMetamask : connectWeb3Wallet}
            className={['min-h-[36px]', mode, className].join(' ')}
            label={address ? truncateAddress(address) : _label || 'Connect Metamask'}
        />
    );
};

import React from 'react';
import { useWalletState } from '../../../hooks/wallet';
import { Button, IButtonProps } from './default';
import { truncateAddress } from '../../../utils/helpers';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const _label = label;

    const { address, connectMetamask } = useWalletState();
    const mode = primary && !address ? '' : '!bg-white !text-black hover:!bg-neutral-200';
    return (
        <Button
            primary
            onClick={connectMetamask}
            className={[
                'box-border',
                'whitespace-nowrap',
                'font-basefont',
                'px-4 py-1',
                '!border-[2px] !border-black !border-solid',
                mode,
                className,
            ].join(' ')}
            label={address ? truncateAddress(address) : _label || 'Connect Metamask'}
        />
    );
};

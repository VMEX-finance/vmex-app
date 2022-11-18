import React from 'react';
import { useWalletState } from '../../../hooks/wallet';
import { Button, IButtonProps } from './default';
import { truncateAddress } from '../../../utils/helpers';
import { useWindowSize } from '../../../hooks/ui';
import { DropdownButton } from './dropdown';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const _label = label;
    const { address, connectMetamask, connectWeb3Wallet } = useWalletState();
    const { width } = useWindowSize();

    const mode = `transition duration-150 ${
        primary && !address ? '' : '!bg-white !text-black hover:!bg-neutral-100'
    }`;

    if (address) {
        return (
            <DropdownButton
                className={['min-h-[36px]', mode, className].join(' ')}
                selected={truncateAddress(address)}
                items={[
                    {
                        text: 'My Tranches',
                        onClick: () => console.log('bang'),
                    },
                    {
                        text: 'History',
                        onClick: () => console.log('History'),
                    },
                ]}
                border
                size="lg"
            />
        );
    } else {
        return (
            <Button
                primary
                onClick={width > 1024 ? connectMetamask : connectWeb3Wallet}
                className={['min-h-[36px]', mode, className].join(' ')}
                label={label}
            />
        );
    }
};

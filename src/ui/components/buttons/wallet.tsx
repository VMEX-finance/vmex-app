import React from 'react';
import { useWalletState } from '../../../hooks/wallet';
import { Button, IButtonProps } from './default';
import { truncate, truncateAddress } from '../../../utils/helpers';
import { useWindowSize } from '../../../hooks/ui';
import { DropdownButton } from './dropdown';
import { useDialogController } from '../../../hooks/dialogs';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const { openDialog } = useDialogController();
    const { address, connectMetamask, connectWeb3Wallet } = useWalletState();
    const { width } = useWindowSize();

    const mode = `transition duration-150 ${
        primary && !address ? '' : '!bg-white !text-black hover:!bg-neutral-100'
    }`;

    const handleOpen = () => {
        openDialog('my-tranches-dialog');
    };

    if (address && width > 1024) {
        return (
            <DropdownButton
                className={['min-h-[36px]', mode, className].join(' ')}
                selected={width > 1400 ? truncateAddress(address) : truncate(address, 3)}
                items={[
                    {
                        text: 'My Tranches',
                        onClick: handleOpen,
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
                className={['min-h-[36px] !py-2 mt-1', mode, className].join(' ')}
                label={address ? truncateAddress(address) : label}
            />
        );
    }
};

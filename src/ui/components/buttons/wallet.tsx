import React from 'react';
import { useWalletState } from '../../../hooks/wallet';
import { Button, IButtonProps } from './default';
import { truncate, truncateAddress } from '../../../utils/helpers';
import { useWindowSize } from '../../../hooks/ui';
import { DropdownButton } from './dropdown';
import { useDialogController } from '../../../hooks/dialogs';
import { useMyTranchesContext } from '../../../store/contexts';

export const WalletButton = ({ primary, className, label = 'Connect Wallet' }: IButtonProps) => {
    const { openDialog } = useDialogController();
    const { address, connectMetamask, isLoading } = useWalletState();
    const { width } = useWindowSize();
    const { myTranches } = useMyTranchesContext();

    const mode = `transition duration-150 ${
        primary && !address ? '' : '!bg-white !text-black hover:!bg-neutral-100'
    }`;

    const renderDropdownItems = () => {
        if (myTranches.length !== 0) {
            return [
                {
                    text: 'My Tranches',
                    onClick: () => openDialog('my-tranches-dialog'),
                },
                {
                    text: 'Create Tranche',
                    onClick: () => openDialog('create-tranche-dialog'),
                },
            ];
        } else {
            return [
                {
                    text: 'Create Tranche',
                    onClick: () => openDialog('create-tranche-dialog'),
                },
            ];
        }
    };

    if (address && width > 1024) {
        return (
            <DropdownButton
                className={['min-h-[36px]', mode, className].join(' ')}
                selected={width > 1400 ? truncateAddress(address) : truncate(address, 3)}
                items={renderDropdownItems()}
                border
                size="lg"
            />
        );
    } else {
        return (
            <Button
                primary
                onClick={connectMetamask} // TODO: add disconnect wallet here
                className={['min-h-[36px] !py-2 mt-1', mode, className].join(' ')}
                label={address ? truncateAddress(address) : label}
                loading={isLoading} // TODO: fix so it shows loading state
            />
        );
    }
};

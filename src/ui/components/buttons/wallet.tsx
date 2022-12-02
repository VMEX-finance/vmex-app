import React from 'react';
import { useWalletState } from '../../../hooks/wallet';
import { Button, IButtonProps } from './default';
import { truncate, truncateAddress } from '../../../utils/helpers';
import { useWindowSize } from '../../../hooks/ui';
import { DropdownButton } from './dropdown';
import { useDialogController } from '../../../hooks/dialogs';
import { useMyTranchesContext } from '../../../store/contexts';
import { useNavigate } from 'react-router-dom';

export const WalletButton = ({
    primary = true,
    className,
    label = 'Connect Wallet',
}: IButtonProps) => {
    const navigate = useNavigate();
    const { openDialog } = useDialogController();
    const { address, connectMetamask, isLoading } = useWalletState();
    const { width } = useWindowSize();
    const { myTranches } = useMyTranchesContext();

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

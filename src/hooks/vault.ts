import { useVaults } from '@/api';
import { inputMediator } from '@/utils';
import React from 'react';
import { useMediatedState } from 'react-use';

export const useVault = (vaultAddress?: string) => {
    const { queryVaults } = useVaults();
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [isMax, setIsMax] = React.useState(false);

    const handleDeposit = async () => {
        // TODO
    };

    const handleWithdraw = async () => {
        // TODO
    };

    return {
        amount,
        setAmount,
        isMax,
        setIsMax,
        handleDeposit,
        handleWithdraw,
    };
};

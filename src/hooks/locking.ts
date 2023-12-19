import { useToken } from './token';
import { fromWeeks, toSeconds, toTime } from '@/utils';
import { BigNumber, utils } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';

const maxWeeks = 52 * 5; // 5 years (10 years is technically the max)

export const useLockingUI = () => {
    const { vmexBalance, dvmexBalance } = useToken();
    const [lockInput, setLockInput] = useState({
        amount: '',
        amountBn: BigNumber.from(0),
        period: '',
        periodBn: BigNumber.from(0),
    });
    const [extendInput, setExtendInput] = useState({ period: '', periodBn: BigNumber.from(0) });
    const [redeemInput, setRedeemInput] = useState({ amount: '', amountBn: BigNumber.from(0) });
    const [error, setError] = useState('');

    const unlockTimeSeconds = useMemo((): number => {
        return toSeconds(Date.now() + fromWeeks(toTime(lockInput.period)));
    }, [lockInput.amount]);

    function handleLockAmountInput(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target?.value;
        setLockInput({ ...lockInput, amount: val, amountBn: utils.parseEther(val || '0') });
    }

    function handleLockPeriodInput(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target?.value;
        setLockInput({ ...lockInput, period: val, periodBn: BigNumber.from(val || '0') });
    }

    function handleRedeemAmountInput(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target?.value;
        setRedeemInput({ ...redeemInput, amount: val, amountBn: utils.parseEther(val || '0') });
    }

    function handleExtendInput(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target?.value;
        setExtendInput({ ...extendInput, period: val, periodBn: utils.parseEther(val || '0') });
    }

    function handlePeriodMax(e: React.ChangeEvent<HTMLInputElement>) {
        const years = maxWeeks.toString();
        const max = { string: years, bn: BigNumber.from(maxWeeks) };
        setLockInput({ ...lockInput, period: max.string, periodBn: max.bn });
    }

    function handleAmountMax(e: React.ChangeEvent<HTMLInputElement>) {
        let max = { string: '', bn: BigNumber.from(0) };
        if (vmexBalance) {
            max = { string: vmexBalance.formatted, bn: vmexBalance.value };
        }
        setLockInput({ ...lockInput, amount: max.string, amountBn: max.bn });
    }

    function handleRedeemMax(e: React.ChangeEvent<HTMLInputElement>) {
        let max = { string: '', bn: BigNumber.from(0) };
        if (dvmexBalance) {
            max = { string: dvmexBalance.formatted, bn: dvmexBalance.value };
        }
        setRedeemInput({ ...redeemInput, amount: max.string, amountBn: max.bn });
    }

    // Handle input errors
    useEffect(() => {
        if (vmexBalance?.value && vmexBalance?.value.gt(BigNumber.from('0'))) {
            if (lockInput?.amountBn.gt(vmexBalance.value)) {
                // User trying to input more VMEX than they hold
                setError('amount: greater than max');
            } else if (Number(lockInput?.period) > maxWeeks) {
                setError('period: greater than max');
            } else if (Number(lockInput?.period) < 1 && lockInput?.period) {
                setError('period: less than minimum');
            } else {
                setError('');
            }
        }
    }, [lockInput.amount, lockInput.period, extendInput.period]);

    // Clear error after 5 seconds
    const CLEAR_TIMER = 5 * 1000;
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(''), CLEAR_TIMER);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    return {
        lockInput,
        extendInput,
        handleExtendInput,
        handleLockAmountInput,
        handleLockPeriodInput,
        inputError: error,
        handleAmountMax,
        handlePeriodMax,
        periodInputError: error?.startsWith('period'),
        amountInputError: error?.startsWith('amount'),
        unlockTimeSeconds,
        handleRedeemAmountInput,
        handleRedeemMax,
        redeemInput,
    };
};

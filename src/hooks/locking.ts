import { useToken } from './token';
import { fromWeeks, toSeconds, toTime } from '@/utils';
import { BigNumber, utils } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';

const maxWeeks = 52 * 5; // 5 years (10 years is technically the max)

const defaultPeriod = { period: '', periodBn: BigNumber.from(0) };
const defaultAmount = { amount: '', amountBn: BigNumber.from(0) };

export const useLockingUI = () => {
    const { vmexBalance, dvmexBalance } = useToken();
    const [lockInput, setLockInput] = useState({ ...defaultAmount, ...defaultPeriod });
    const [extendInput, setExtendInput] = useState(defaultPeriod);
    const [redeemInput, setRedeemInput] = useState(defaultAmount);
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
                setError('amount:Insufficient balance');
            } else if (Number(lockInput?.period) > maxWeeks) {
                setError(`period:Cannot be more than ${maxWeeks} weeks`);
            } else if (Number(lockInput?.period) < 1 && lockInput?.period) {
                setError('period:Cannot be less than 1 week');
            } else if (Number(extendInput?.period) > maxWeeks) {
                setError(`extend:Cannot be more than ${maxWeeks} weeks`);
            } else if (Number(extendInput?.period) < 1 && extendInput?.period) {
                setError('extend:Cannot be less than 1 week');
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

    const clearInputs = () => {
        setExtendInput(defaultPeriod);
        setRedeemInput(defaultAmount);
        setLockInput({ ...defaultAmount, ...defaultPeriod });
    };

    return {
        lockInput,
        extendInput,
        handleExtendInput,
        handleLockAmountInput,
        handleLockPeriodInput,
        inputError: error?.includes(':') ? error?.split(':')[1] : '',
        handleAmountMax,
        handlePeriodMax,
        periodInputError: error?.startsWith('period'),
        amountInputError: error?.startsWith('amount'),
        extendPeriodError: error?.startsWith('extend'),
        unlockTimeSeconds,
        handleRedeemAmountInput,
        handleRedeemMax,
        redeemInput,
        clearInputs,
    };
};

import { useSubgraphTranchesOverviewData } from '@/api';
import { useTransactionsContext, useVaultsContext } from '@/store';
import { TESTING, inputMediator, toSymbol } from '@/utils';
import {
    erc20ABI,
    erc4626ABI,
    multicall,
    prepareWriteContract,
    readContract,
    writeContract,
} from '@wagmi/core';
import { BigNumber, constants, utils } from 'ethers';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMediatedState } from 'react-use';
import { useAccount, useBalance, useContractReads } from 'wagmi';

export const useVault = (vaultAddress?: string, gaugeAddress?: string, vaultSymbol?: string) => {
    const { vaults } = useVaultsContext();
    const { address } = useAccount();
    const { queryAllTranches } = useSubgraphTranchesOverviewData();
    const { newTransaction } = useTransactionsContext();
    const [amount, setAmount] = useMediatedState(inputMediator, '');
    const [isMax, setIsMax] = React.useState(false);
    const [selected, setSelected] = useState(vaults[0]?.vaultAddress || '');
    const { data: gaugeBalance } = useBalance({
        address,
        token: gaugeAddress as `0x${string}`,
        watch: true,
    });
    const { data: vaultBalance } = useBalance({
        address,
        token: vaultAddress as `0x${string}`,
        watch: true,
    });
    const [loading, setLoading] = useState({
        deposit: false,
        depositApprove: false,
        withdraw: false,
        withdrawApprove: false,
    });

    const vaultConfig = { address: vaultAddress as `0x${string}`, abi: erc20ABI };
    const gaugeConfig = { address: gaugeAddress as `0x${string}`, abi: erc4626ABI };
    const vaultDetails = useContractReads({
        contracts: [
            {
                ...gaugeConfig,
                functionName: 'totalAssets',
            },
            {
                ...gaugeConfig,
                functionName: 'totalSupply',
            },
            {
                ...gaugeConfig,
                functionName: 'previewRedeem',
                args: [vaultBalance?.value || BigNumber.from(0)],
            },
            {
                ...gaugeConfig,
                functionName: 'balanceOf',
                args: [address || constants.AddressZero],
            },
            {
                ...vaultConfig,
                functionName: 'allowance',
                args: [
                    address || constants.AddressZero,
                    (gaugeAddress || constants.AddressZero) as `0x${string}`,
                ],
            },
        ],
        enabled: !!address && !!gaugeAddress && !!vaultAddress,
    });

    function approvedEnough() {
        if (!amount || !vaultDetails.data?.[4]) return false;
        const allowance = utils.formatUnits(vaultDetails.data?.[4]);
        const bnAmount = utils.parseUnits(amount); // TODO: handle decimals
        console.log('Approved Enough:', Number(bnAmount) > Number(allowance));
        return Number(bnAmount) > Number(allowance);
    }

    async function handleDeposit(e: any) {
        e.preventDefault();
        if (!address || !gaugeConfig.address || !gaugeConfig.address) return;
        if (Number(amount) === 0 || !amount) {
            // TODO: handle error
            return;
        }
        try {
            const bnAmount = utils.parseUnits(amount); // TODO: handle decimals
            const allowance = utils.formatUnits(vaultDetails.data?.[4] || BigNumber.from(0));

            // Handle approval
            if (approvedEnough()) {
                setLoading({ ...loading, depositApprove: true });
                const prepApproveTx = await prepareWriteContract({
                    ...vaultConfig,
                    functionName: 'approve',
                    args: [gaugeConfig.address, bnAmount],
                });
                const approveTx = await writeContract(prepApproveTx);
                await Promise.all([newTransaction(approveTx), approveTx.wait]);
                setLoading({ ...loading, depositApprove: false });
            }

            // Handle Deposit
            setLoading({ ...loading, deposit: true });
            const args = [bnAmount, address] as any;
            if (TESTING) console.log('Deposit Args:', args);
            const prepDepositTx = await prepareWriteContract({
                ...gaugeConfig,
                functionName: 'deposit',
                args,
            });
            const depositTx = await writeContract(prepDepositTx);
            await Promise.all([newTransaction(depositTx), depositTx.wait]);
            setLoading({ ...loading, deposit: false });
            setAmount('');
        } catch (err) {
            toast.dismiss();
            setLoading({ ...loading, deposit: false, depositApprove: false });
            console.error(err);
            toast.error('Error submitting transaction', { autoClose: 3000 });
        }
    }

    async function handleWithdraw(e: any) {
        e.preventDefault();
        if (!address || !gaugeConfig.address || !gaugeConfig.address) return;
        if (Number(amount) === 0 || !amount) {
            // TODO: handle error
            return;
        }
        try {
            const bnAmount = utils.parseUnits(amount); // TODO: handle decimals

            // Handle Deposit
            setLoading({ ...loading, withdraw: true });
            const args = [bnAmount, address, address] as any;
            if (TESTING) console.log('Withdraw Args:', args);
            const prepWithdrawTx = await prepareWriteContract({
                ...gaugeConfig,
                functionName: 'withdraw',
                args,
            });
            const withdrawTx = await writeContract(prepWithdrawTx);
            await Promise.all([newTransaction(withdrawTx), withdrawTx.wait]);
            setLoading({ ...loading, withdraw: false });
            setAmount('');
        } catch (err) {
            toast.dismiss();
            setLoading({ ...loading, withdraw: false, withdrawApprove: false });
            console.error(err);
            toast.error('Error submitting transaction', { autoClose: 3000 });
        }
    }

    async function previewWithdraw() {
        if (!gaugeConfig.address) return;
        const bnAmount = utils.parseUnits(amount); // TODO: handle decimals
        return await readContract({
            ...gaugeConfig,
            functionName: 'previewWithdraw',
            args: [bnAmount],
        });
    }

    function getUnderlying() {
        if (!vaultSymbol) return;
        const trimmed = vaultSymbol?.substring(4);
        const trancheId = vaultSymbol.slice(vaultSymbol.length - 1);
        const symbol = trimmed.slice(0, trimmed.length - 1);

        return {
            trancheId: trancheId,
            symbol,
            trancheName: queryAllTranches.data?.find(
                (el) => String(el?.id || 0) === String(trancheId),
            )?.name,
        };
    }

    return {
        underlying: getUnderlying(),
        amount,
        setAmount,
        isMax,
        setIsMax,
        handleDeposit,
        handleWithdraw,
        vaultDetails,
        previewWithdraw,
        loading,
        approvedEnough,
        vaultBalance,
        gaugeBalance,
        selected,
        setSelected,
    };
};

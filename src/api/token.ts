import { useTransactionsContext } from '@/store';
import { CONTRACTS, getChainId, getNetworkName } from '@/utils';
import { VEVMEX_ABI, VEVMEX_OPTIONS_ABI } from '@/utils/abis';
import { erc20ABI, readContract, writeContract, prepareWriteContract } from '@wagmi/core';
import { BigNumber, constants, utils } from 'ethers';
import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

const VMEX_VEVMEX_CHAINID = 5;

/**
 * Contains all functions revolving around VMEX & veVMEX staking
 * @returns
 *      vevmexIsApproved,
 *       vevmexRefreshAllowances,
 *       vevmexRedeem,
 *       tokenLoading: loading,
 *       withdrawLockedVevmex,
 *       withdrawUnlockedVevmex,
 *       getVmexLockEarlyExitPenalty,
 *       extendVmexLockTime,
 *       increaseVmexLockAmount,
 *       lockVmex
 */
export const useToken = () => {
    const { address } = useAccount();
    const { newTransaction } = useTransactionsContext();
    const [loading, setLoading] = useState({
        redeem: false,
        redeemApprove: false,
        lock: false,
        lockApprove: false,
        extendLock: false,
        extendLockApprove: false,
        earlyExit: false,
        earlyExitApprove: false,
        expiredLock: false,
        expiredLockApprove: false,
    });

    const { data: vevmexIsApproved, refetch: vevmexRefreshAllowances } = useContractRead({
        address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
        abi: erc20ABI,
        chainId: VMEX_VEVMEX_CHAINID,
        functionName: 'allowance',
        args: [utils.getAddress(address || ''), '0x VEVMEX_OPTIONS_ADDRESS'], // Is second address multisig?
        // select: (value: bigint): boolean => value >= redeemAmount.raw,
        enabled: !!address,
    });

    const vevmexRedeem = async (amount: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        if (!vevmexIsApproved) {
            setLoading({ ...loading, redeemApprove: true });
            const prepareApproveTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: erc20ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'approve',
                args: [cleanAddress, amount],
            });
            const approveTx = await writeContract(prepareApproveTx);
            setLoading({ ...loading, redeemApprove: false });
        }
        setLoading({ ...loading, redeem: true });
        const prepareRedeemTx = await prepareWriteContract({
            address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
            abi: VEVMEX_OPTIONS_ABI,
            chainId: VMEX_VEVMEX_CHAINID,
            functionName: 'redeem',
            args: [amount, cleanAddress],
        });
        const redeemTx = await writeContract(prepareRedeemTx);
        setLoading({ ...loading, redeem: false });
        await newTransaction(redeemTx);
    };

    const lockVmex = async (amount: BigNumber, time: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        // TODO: approval if necessary
        setLoading({ ...loading, lock: true });
        const prepareLockTx = await prepareWriteContract({
            address: constants.AddressZero, // TODO
            abi: VEVMEX_ABI,
            chainId: VMEX_VEVMEX_CHAINID,
            functionName: 'modify_lock',
            args: [amount, time, cleanAddress],
        });
        const lockTx = await writeContract(prepareLockTx);
        setLoading({ ...loading, lock: false });
        await newTransaction(lockTx);
    };

    const increaseVmexLockAmount = async (amount: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        // TODO: approval if necessary
        setLoading({ ...loading, lock: true });
        const prepareLockTx = await prepareWriteContract({
            address: constants.AddressZero, // TODO
            abi: VEVMEX_ABI,
            chainId: VMEX_VEVMEX_CHAINID,
            functionName: 'modify_lock',
            args: [amount, BigNumber.from(0), cleanAddress],
        });
        const lockTx = await writeContract(prepareLockTx);
        setLoading({ ...loading, lock: false });
        await newTransaction(lockTx);
    };

    const extendVmexLockTime = async (time: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        // TODO: approval if necessary
        setLoading({ ...loading, extendLock: true });
        const prepareLockTx = await prepareWriteContract({
            address: constants.AddressZero, // TODO
            abi: VEVMEX_ABI,
            chainId: VMEX_VEVMEX_CHAINID,
            functionName: 'modify_lock',
            args: [BigNumber.from(0), time, cleanAddress],
        });
        const lockTx = await writeContract(prepareLockTx);
        setLoading({ ...loading, extendLock: false });
        await newTransaction(lockTx);
    };

    const getVmexLockEarlyExitPenalty = async () => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        try {
            const prepareEarlyExit = await prepareWriteContract({
                address: constants.AddressZero, // TODO
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'withdraw',
            });
            return prepareEarlyExit.request.value; // TODO
        } catch (e) {
            return BigNumber.from(0);
        }
    };

    const withdrawUnlockedVevmex = async () => {
        // TODO
    };

    const withdrawLockedVevmex = async () => {
        // TODO
    };

    return {
        vevmexIsApproved,
        vevmexRefreshAllowances,
        vevmexRedeem,
        tokenLoading: loading,
        withdrawLockedVevmex,
        withdrawUnlockedVevmex,
        getVmexLockEarlyExitPenalty,
        extendVmexLockTime,
        increaseVmexLockAmount,
        lockVmex,
    };
};

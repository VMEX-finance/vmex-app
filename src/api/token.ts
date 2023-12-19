import { useTransactionsContext } from '@/store';
import { CONTRACTS, TESTING, getChainId, getNetworkName } from '@/utils';
import { VEVMEX_ABI, VEVMEX_OPTIONS_ABI } from '@/utils/abis';
import { erc20ABI, readContract, writeContract, prepareWriteContract } from '@wagmi/core';
import { BigNumber, constants, utils } from 'ethers';
import { useState } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';

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
 *       lockVmex,
 *       vmexBalance,
 *       veVmexBalance
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
    const { data: vmexBalance } = useBalance({
        address,
        chainId: VMEX_VEVMEX_CHAINID,
        watch: true,
        enabled: !!address,
        token: CONTRACTS[VMEX_VEVMEX_CHAINID].vmex as any,
    });

    const { data: vevmexIsApproved, refetch: vevmexRefreshAllowances } = useContractRead({
        address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmex as `0x${string}`,
        abi: erc20ABI,
        chainId: VMEX_VEVMEX_CHAINID,
        functionName: 'allowance',
        args: [
            utils.getAddress(address || ''),
            CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
        ],
        enabled: !!address,
    });

    const inputToBn = (val: string) => {
        // TODO: better handling when
        if (val && Number(val) > 0) return utils.parseEther(val); // veVMEX and VMEX tokens are 18 decimals
        return BigNumber.from('0');
    };

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
            await newTransaction(approveTx);
            await approveTx.wait();
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

    /**
     * @param amount BN amount of VMEX tokens locking
     * @param time BN time when VMEX will be unlocked
     */
    const lockVmex = async (amount: BigNumber, time: BigNumber) => {
        try {
            if (!address || amount.eq(BigNumber.from(0)) || time.eq(BigNumber.from(0))) return;
            const cleanAddress = utils.getAddress(address);
            // approval if necessary
            if (TESTING)
                console.log(
                    'VMEX Allowance:',
                    utils.formatEther(vevmexIsApproved || BigNumber.from(0)),
                );
            if (TESTING)
                console.log('Amount:', utils.formatEther(amount), 'Time:', utils.formatUnits(time));
            if (vevmexIsApproved && vevmexIsApproved.lt(amount)) {
                const prepareApproveTx = await prepareWriteContract({
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmex as `0x${string}`,
                    abi: erc20ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'approve',
                    args: [CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`, amount],
                });
                setLoading({ ...loading, lockApprove: true });
                if (TESTING) console.log('Approve VMEX Spend TX:', prepareApproveTx);
                const approveTx = await writeContract(prepareApproveTx);
                await Promise.all([newTransaction(approveTx), approveTx.wait()]);
                setLoading({ ...loading, lockApprove: false });
            }
            const prepareLockTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'modify_lock',
                args: [amount, time, cleanAddress],
            });
            if (TESTING) console.log('Lock VMEX TX:', prepareLockTx);
            const lockTx = await writeContract(prepareLockTx);
            setLoading({ ...loading, lock: true });
            await Promise.all([newTransaction(lockTx), lockTx.wait()]);
            setLoading({ ...loading, lock: false });
        } catch (e) {
            console.error('#lockVmex:', e);
        }
    };

    const increaseVmexLockAmount = async (amount: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        // TODO: approval if necessary
        setLoading({ ...loading, lock: true });
        const prepareLockTx = await prepareWriteContract({
            address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
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
            address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
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
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
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
        vmexBalance,
        inputToBn,
    };
};

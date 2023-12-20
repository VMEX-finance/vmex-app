import { useTransactionsContext } from '@/store';
import { CONTRACTS, TESTING, toWeeks, weeksToUnixBn, weeksUntilUnlock } from '@/utils';
import { VEVMEX_ABI, VEVMEX_OPTIONS_ABI } from '@/utils/abis';
import { useQueries } from '@tanstack/react-query';
import { erc20ABI, writeContract, prepareWriteContract, readContracts } from '@wagmi/core';
import { BigNumber, constants, utils } from 'ethers';
import { useState } from 'react';
import { useAccount, useBalance, useContractRead } from 'wagmi';

export const VMEX_VEVMEX_CHAINID = 5;

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
export const useToken = (clearInputs?: () => void) => {
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

    const { data: dvmexBalance } = useBalance({
        address,
        chainId: VMEX_VEVMEX_CHAINID,
        watch: true,
        enabled: !!address,
        token: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmex as any,
    });

    const { data: vevmexIsApproved, refetch: vevmexRefreshAllowances } = useContractRead({
        address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmex as `0x${string}`,
        abi: erc20ABI,
        chainId: VMEX_VEVMEX_CHAINID,
        functionName: 'allowance',
        args: [
            address || constants.AddressZero,
            CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
        ],
        enabled: !!address ?? false,
        watch: address ? true : false,
    });

    const getVevmexUserData = async () => {
        if (!address) return;
        const data = await readContracts({
            contracts: [
                {
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                    abi: VEVMEX_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'balanceOf',
                    args: [address],
                },
                {
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                    abi: VEVMEX_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'locked',
                    args: [address],
                },
            ],
        });
        return {
            votingPower: utils.formatEther(data[0]),
            locked: {
                end: {
                    normalized: weeksUntilUnlock(data[1]?.end),
                    raw: data[1]?.end,
                },
                amount: {
                    normalized: utils.formatEther(data[1]?.amount),
                    raw: data[1]?.amount,
                },
            },
            exitPreview: '', // TODO
        };
    };

    const getVevmexMetaData = async () => {
        const data = await readContracts({
            contracts: [
                {
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                    abi: VEVMEX_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'totalSupply',
                },
                {
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                    abi: VEVMEX_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'supply',
                },
                {
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                    abi: VEVMEX_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'reward_pool',
                },
            ],
        });
        return {
            totalVotingPower: utils.formatEther(data[0]),
            supply: utils.formatEther(data[1]),
        };
    };

    const getVmexLockEarlyExitPenalty = async () => {
        if (!address) return;
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

    const queries = useQueries({
        queries: [
            {
                queryKey: ['vevmex-data'],
                queryFn: getVevmexMetaData,
                refetchInterval: 30 * 1000,
            },
            {
                queryKey: ['vevmex-user-data', address],
                queryFn: getVevmexUserData,
                refetchInterval: 10 * 1000,
            },
            {
                queryKey: ['vevmex-early-exit-penalty', address],
                queryFn: getVmexLockEarlyExitPenalty,
            },
        ],
    });

    const inputToBn = (val: string) => {
        // TODO: better handling when
        if (val && Number(val) > 0) return utils.parseEther(val); // veVMEX and VMEX tokens are 18 decimals
        return BigNumber.from('0');
    };

    // TODO
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
        clearInputs && clearInputs();
    };

    // TODO
    const dvmexRedeem = async (amount: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        if (!vevmexIsApproved) {
            setLoading({ ...loading, redeemApprove: true });
            const prepareApproveTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmex as `0x${string}`,
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
            address: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmex as `0x${string}`,
            abi: VEVMEX_OPTIONS_ABI,
            chainId: VMEX_VEVMEX_CHAINID,
            functionName: 'redeem',
            args: [amount, cleanAddress],
        });
        const redeemTx = await writeContract(prepareRedeemTx);
        setLoading({ ...loading, redeem: false });
        await newTransaction(redeemTx);
        clearInputs && clearInputs();
    };

    /**
     * @param amount - BN amount of VMEX tokens locking
     * @param time - BN time when VMEX will be unlocked
     */
    const lockVmex = async (amount: BigNumber, time: BigNumber) => {
        try {
            if (!address || amount.eq(BigNumber.from(0)) || time.eq(BigNumber.from(0))) return;
            if (TESTING)
                console.log(
                    'VMEX Allowance:',
                    utils.formatEther(vevmexIsApproved || BigNumber.from(0)),
                );
            if (TESTING)
                console.log('Amount:', utils.formatEther(amount), '\nTime:', time.toString());
            // Approval TX - if necessary
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
            // Lock TX
            if (TESTING) console.log('VMEX Lock Args:', [amount.toString(), time.toString()]);
            const prepareLockTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'modify_lock',
                args: [amount, BigNumber.from(time)], // remember to change
            });
            // 1703024518854
            // 1734552024
            if (TESTING) console.log('Lock VMEX TX:', prepareLockTx);
            const lockTx = await writeContract(prepareLockTx);
            setLoading({ ...loading, lock: true });
            await Promise.all([newTransaction(lockTx), lockTx.wait()]);
            setLoading({ ...loading, lock: false });
            clearInputs && clearInputs();
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
            args: [amount, BigNumber.from(0)],
        });
        const lockTx = await writeContract(prepareLockTx);
        setLoading({ ...loading, lock: false });
        await newTransaction(lockTx);
        clearInputs && clearInputs();
    };

    const extendVmexLockTime = async (time: BigNumber) => {
        if (queries[1]?.data?.locked?.amount?.raw === BigNumber.from(0)) return;
        if (!address) return;
        try {
            setLoading({ ...loading, extendLock: true });
            const addedWeeks = weeksUntilUnlock(time);
            const currentWeeks = Number(queries[1]?.data?.locked?.amount?.normalized);
            const newTime = weeksToUnixBn(addedWeeks + currentWeeks);
            const prepareLockTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'modify_lock',
                args: [BigNumber.from(0), newTime],
            });
            const lockTx = await writeContract(prepareLockTx);
            setLoading({ ...loading, extendLock: false });
            await newTransaction(lockTx);
            clearInputs && clearInputs();
        } catch (e) {
            console.error(e);
        }
    };

    const withdrawUnlockedVevmex = async () => {
        // TODO
    };

    const withdrawLockedVevmex = async () => {
        // TODO
        // try {
        // } catch (e) {
        //     console.log(e);
        // }
    };

    return {
        vevmexIsApproved,
        vevmexRefreshAllowances,
        vevmexRedeem,
        tokenLoading: loading,
        withdrawLockedVevmex,
        withdrawUnlockedVevmex,
        vmexLockEarlyExitPenalty: queries[2],
        extendVmexLockTime,
        increaseVmexLockAmount,
        lockVmex,
        vmexBalance,
        inputToBn,
        vevmexMetaData: queries[0],
        vevmexUserData: queries[1],
        dvmexBalance,
        dvmexRedeem,
    };
};

import { useTransactionsContext } from '@/store';
import { IAddress } from '@/types/wagmi';
import { CONTRACTS, TESTING, VMEX_VEVMEX_CHAINID, weeksUntilUnlock } from '@/utils';
import { VEVMEX_ABI, VEVMEX_OPTIONS_ABI, VEVMEX_POSITION_HELPER_ABI } from '@/utils/abis';
import { useQueries } from '@tanstack/react-query';
import { erc20ABI, writeContract, prepareWriteContract, readContracts } from '@wagmi/core';
import { BigNumber, constants, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { useState } from 'react';
import { useAccount, useBalance, useBlockNumber, useContractRead } from 'wagmi';

/**
 * Contains all functions revolving around VMEX & veVMEX staking
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
    const { data: vw8020Balance } = useBalance({
        address,
        chainId: VMEX_VEVMEX_CHAINID,
        watch: true,
        enabled: !!address,
        token: CONTRACTS[VMEX_VEVMEX_CHAINID].vmexWeth as any,
    });

    const { data: dvmexBalance } = useBalance({
        address,
        chainId: VMEX_VEVMEX_CHAINID,
        watch: true,
        enabled: !!address,
        token: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmex as any,
    });

    const { data: vevmexIsApproved, refetch: vevmexRefreshAllowances } = useContractRead({
        address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmexWeth as `0x${string}`,
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

    const WEEK = 7 * 86400;
    const MAX_LOCK_DURATION = Math.floor((4 * 365 * 86400) / WEEK) * WEEK;
    const SCALE = BigNumber.from(10).pow(18);
    const MAX_PENALTY_RATIO = SCALE.mul(3).div(4);
    const vevmexConfig = {
        address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as IAddress,
        abi: VEVMEX_ABI,
        chainId: VMEX_VEVMEX_CHAINID,
    };

    const getVevmexUserData = async () => {
        if (!address) return;
        const [balance, { end, amount }] = await readContracts({
            contracts: [
                {
                    ...vevmexConfig,
                    functionName: 'balanceOf',
                    args: [address],
                },
                {
                    ...vevmexConfig,
                    functionName: 'locked',
                    args: [address],
                },
            ],
        });

        const now = Math.floor(Date.now() / 1000);
        let penalty = 0;
        if (end.gt(now)) {
            const timeLeft = end.sub(now).lt(MAX_LOCK_DURATION)
                ? end.sub(now)
                : BigNumber.from(MAX_LOCK_DURATION);
            const penaltyRatio = timeLeft.mul(SCALE).div(MAX_LOCK_DURATION).lt(MAX_PENALTY_RATIO)
                ? timeLeft.mul(SCALE).div(MAX_LOCK_DURATION)
                : MAX_PENALTY_RATIO;
            const formatted = penaltyRatio.mul('10000').div(SCALE).toNumber();
            penalty = formatted / (100 * 100);
        }

        return {
            votingPower: utils.formatEther(balance),
            locked: {
                end: {
                    normalized: weeksUntilUnlock(end),
                    raw: end,
                },
                amount: {
                    normalized: utils.formatEther(amount),
                    raw: amount,
                },
            },
            unlocked: {
                normalized: '0.0',
                raw: BigNumber.from(0),
            },
            exitPreview: formatEther(amount.sub(amount.mul((penalty * 100).toFixed(0)).div(100))),
            penalty,
        };
    };

    const getVevmexMetaData = async () => {
        const currentData = await readContracts({
            contracts: [
                {
                    ...vevmexConfig,
                    functionName: 'totalSupply',
                },
                {
                    ...vevmexConfig,
                    functionName: 'supply',
                },
                {
                    ...vevmexConfig,
                    functionName: 'reward_pool',
                },
                // {
                //     ...vevmexConfig,
                //     functionName: 'totalSupplyAt',
                //     args: [BigNumber.from(10238156)] // Block number when contract created on Goerli
                // },
            ],
        });
        return {
            totalVotingPower: utils.formatEther(currentData[0]),
            supply: utils.formatEther(currentData[1]),
            rewardPool: utils.getAddress(currentData[2]),
        };
    };

    // const getPositionsData = async () => {
    //     if (!address) return;
    //     try {
    //         const earlyExitRead = await readContract({
    //             address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
    //             abi: VEVMEX_POSITION_HELPER_ABI,
    //             chainId: VMEX_VEVMEX_CHAINID,
    //             functionName: 'getPositionDetails',
    //             args: [address],
    //         });
    //         return earlyExitRead;
    //     } catch (e) {
    //         console.error('#getPositionsData:', e);
    //         return {
    //             balance: BigNumber.from(0),
    //             depositAmount: BigNumber.from(0),
    //             withdrawable: BigNumber.from(0),
    //             penalty: BigNumber.from(0),
    //             unlockTime: BigNumber.from(0),
    //             timeRemaining: BigNumber.from(0),
    //         };
    //     }
    // };

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
                enabled: !!address,
            },
            // {
            //     queryKey: ['vevmex-positions', address],
            //     queryFn: getPositionsData,
            //     enabled: !!address,
            //     initialData: {
            //         balance: BigNumber.from(0),
            //         depositAmount: BigNumber.from(0),
            //         withdrawable: BigNumber.from(0),
            //         penalty: BigNumber.from(0),
            //         unlockTime: BigNumber.from(0),
            //         timeRemaining: BigNumber.from(0),
            //     },
            // },
        ],
    });

    const inputToBn = (val: string) => {
        // TODO: better handling when
        if (val && Number(val) > 0) return utils.parseEther(val); // veVMEX and VMEX tokens are 18 decimals
        return BigNumber.from('0');
    };

    // TODO
    const vevmexRedeem = async (amount: BigNumber) => {
        if (!address || amount === BigNumber.from(0) || !amount) return;
        const cleanAddress = utils.getAddress(address);
        if (vevmexIsApproved && vevmexIsApproved.lt(amount)) {
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
        if (!address || amount === BigNumber.from(0) || !amount) return;
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
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmexWeth as `0x${string}`,
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
                args: [amount, BigNumber.from(time)], // TODO: fix time
            });
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
        if (!address || amount === BigNumber.from(0) || !amount) return;
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

    const WEEK_BN = BigNumber.from(7).mul(24).mul(60).mul(60);
    const extendVmexLockTime = async (addedWeeks: Number) => {
        if (
            !queries[1]?.data?.locked.end.raw ||
            queries[1]?.data?.locked?.amount?.raw === BigNumber.from(0) ||
            !addedWeeks
        )
            return;
        if (!address) return;
        try {
            setLoading({ ...loading, extendLock: true });
            const newTime = WEEK_BN.mul(addedWeeks.toString()).add(
                queries[1]?.data?.locked.end.raw,
            );
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

    // TODO
    const withdrawLockedVevmex = async () => {
        if (!address) return;
        try {
            setLoading({ ...loading, earlyExit: true });
            const prepareEarlyExit = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'withdraw',
            });
            const earlyExitTx = await writeContract(prepareEarlyExit);
            await Promise.all([newTransaction(earlyExitTx), earlyExitTx.wait()]);
            setLoading({ ...loading, earlyExit: false });
            clearInputs && clearInputs();
        } catch (e) {
            console.log(e);
        }
    };

    return {
        vevmexIsApproved,
        vevmexRefreshAllowances,
        vevmexRedeem,
        tokenLoading: loading,
        withdrawLockedVevmex,
        withdrawUnlockedVevmex,
        extendVmexLockTime,
        increaseVmexLockAmount,
        lockVmex,
        vmexBalance,
        inputToBn,
        vevmexMetaData: queries[0],
        vevmexUserData: queries[1],
        dvmexBalance,
        dvmexRedeem,
        vw8020Balance,
    };
};

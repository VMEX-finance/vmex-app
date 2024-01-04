import { useTransactionsContext } from '@/store';
import { IAddress } from '@/types/wagmi';
import { CONTRACTS, LOGS, VMEX_VEVMEX_CHAINID, weeksUntilUnlock } from '@/utils';
import { VEVMEX_ABI, VMEXWETH_ABI, VEVMEX_OPTIONS_ABI } from '@/utils/abis';
import { useQueries } from '@tanstack/react-query';
import {
    erc20ABI,
    writeContract,
    prepareWriteContract,
    readContracts,
    readContract,
} from '@wagmi/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';
import { SyntheticEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useBalance, useContractRead, useContractReads } from 'wagmi';

const DEFAULT_LOADING = {
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
};

const WEEK = 7 * 86400;
const MAX_LOCK_DURATION = Math.floor((4 * 365 * 86400) / WEEK) * WEEK;
const SCALE = BigNumber.from(10).pow(18);
const MAX_PENALTY_RATIO = SCALE.mul(3).div(4);

/**
 * Contains all functions revolving around VMEX & veVMEX staking
 */
export const useToken = (clearInputs?: () => void) => {
    const { address } = useAccount();
    const { newTransaction } = useTransactionsContext();
    const [loading, setLoading] = useState(DEFAULT_LOADING);
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

    const { data: allowances, refetch: refreshAllowances } = useContractReads({
        contracts: [
            {
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmexWeth as `0x${string}`,
                abi: erc20ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'allowance',
                args: [
                    address || constants.AddressZero,
                    CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                ],
            },
            {
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmex as `0x${string}`,
                abi: erc20ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'allowance',
                args: [
                    address || constants.AddressZero,
                    CONTRACTS[VMEX_VEVMEX_CHAINID].redemption as `0x${string}`,
                ],
            },
        ],
        enabled: !!address ?? false,
        watch: address ? true : false,
    });

    const { data: vmexPriceInEth } = useContractRead({
        address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmexWeth as `0x${string}`,
        abi: VMEXWETH_ABI,
        chainId: VMEX_VEVMEX_CHAINID,
        functionName: 'getTimeWeightedAverage',
        args: [
            /**
             * price = getTimeWeightedAverage([
             *   variable: IBalancerTwapOracle.Variable.PAIR_PRICE,
             *   secs: twapPeriod,
             *   ago: 0
             * ])
             *
             * PAIR_PRICE enum value = 0
             * twapPeriod = 1 hour = 60*60
             * ago = 0
             *
             * https://github.com/VMEX-finance/veVMEX/blob/master/src/test/Redemption.t.sol#L231
             * */

            [
                {
                    variable: 0,
                    secs: BigNumber.from(3600),
                    ago: BigNumber.from(0),
                },
            ],
        ],
    });

    let vmexPriceInEthNoDecimals = 0;
    if (vmexPriceInEth) {
        vmexPriceInEthNoDecimals = Number(
            ethers.utils.formatUnits(vmexPriceInEth[0].toString(), 18),
        );
    }

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
        const exitPreview = formatEther(
            amount.sub(amount.mul((penalty * 100).toFixed(0)).div(100)),
        );
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
                normalized: exitPreview === utils.formatEther(amount) ? exitPreview : '0.0',
                raw: exitPreview === utils.formatEther(amount) ? amount : BigNumber.from(0),
            },
            exitPreview,
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
            {
                queryKey: ['dvmex-discount'],
                queryFn: async () => {
                    const discount = await readContract({
                        address: CONTRACTS[VMEX_VEVMEX_CHAINID].redemption,
                        abi: VEVMEX_OPTIONS_ABI,
                        functionName: 'discount',
                    });
                    return utils.formatEther(discount);
                },
                refetchInterval: 60 * 1000,
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
        try {
            if (allowances?.[0] && allowances?.[0]?.lt(amount)) {
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
        } catch (e) {
            console.error(e);
            if (!String(e).includes('User rejected request'))
                toast.error('Error occured while redeeming');
        }
    };

    // TODO
    const dvmexRedeem = async (amount: BigNumber, ethRequired: BigNumber) => {
        if (
            !address ||
            amount === BigNumber.from(0) ||
            !amount ||
            ethRequired === BigNumber.from(0)
        )
            return;
        const cleanAddress = utils.getAddress(address);

        try {
            if (LOGS) console.log('#dvmexRedeem::allowances:', allowances);
            if (allowances?.[1] && allowances?.[1]?.lt(amount)) {
                setLoading({ ...loading, redeemApprove: true });
                const prepareApproveTx = await prepareWriteContract({
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmex as `0x${string}`,
                    abi: erc20ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'approve',
                    args: [CONTRACTS[VMEX_VEVMEX_CHAINID].redemption, amount],
                });
                const approveTx = await writeContract(prepareApproveTx);
                await newTransaction(approveTx);
                await approveTx.wait();
                setLoading({ ...loading, redeemApprove: false });
            }
            setLoading({ ...loading, redeem: true });
            const prepareRedeemTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].redemption as `0x${string}`,
                abi: VEVMEX_OPTIONS_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'redeem',
                args: [amount, cleanAddress],
                overrides: {
                    value: ethRequired,
                },
            });
            if (LOGS) console.log('#dvmexRedeem::prepareRedeemTx:', prepareRedeemTx);
            const redeemTx = await writeContract(prepareRedeemTx);
            setLoading({ ...loading, redeem: false });
            await newTransaction(redeemTx);
            clearInputs && clearInputs();
        } catch (e) {
            console.error(e);
            setLoading({ ...loading, redeem: false });
            if (!String(e).includes('User rejected request'))
                toast.error('Error occured while redeeming');
        }
    };

    /**
     * @param amount - BN amount of VMEX tokens locking
     * @param time - BN time when VMEX will be unlocked
     */
    const lockVmex = async (amount: BigNumber, time: BigNumber) => {
        try {
            if (!address || amount.eq(BigNumber.from(0)) || time.eq(BigNumber.from(0))) return;
            if (LOGS)
                console.log(
                    '#lockVmex::VMEX Allowance:',
                    utils.formatEther(allowances?.[0] || BigNumber.from(0)),
                );
            if (LOGS)
                console.log(
                    '#lockVmex::Amount:',
                    utils.formatEther(amount),
                    '\nTime:',
                    time.toString(),
                );
            // Approval TX - if necessary
            if (allowances?.[0] && allowances?.[0]?.lt(amount)) {
                const prepareApproveTx = await prepareWriteContract({
                    address: CONTRACTS[VMEX_VEVMEX_CHAINID].vmexWeth as `0x${string}`,
                    abi: erc20ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'approve',
                    args: [CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`, amount],
                });
                setLoading({ ...loading, lockApprove: true });
                if (LOGS) console.log('#lockVmex::Approve VMEX Spend TX:', prepareApproveTx);
                const approveTx = await writeContract(prepareApproveTx);
                await Promise.all([newTransaction(approveTx), approveTx.wait()]);
                setLoading({ ...loading, lockApprove: false });
            }
            // Lock TX
            if (LOGS)
                console.log('#lockVmex::VMEX Lock Args:', [amount.toString(), time.toString()]);
            const prepareLockTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'modify_lock',
                args: [amount, BigNumber.from(time)], // TODO: fix time
            });
            if (LOGS) console.log('#lockVmex::Lock VMEX TX:', prepareLockTx);
            const lockTx = await writeContract(prepareLockTx);
            setLoading({ ...loading, lock: true });
            await Promise.all([newTransaction(lockTx), lockTx.wait()]);
            setLoading({ ...loading, lock: false });
            clearInputs && clearInputs();
        } catch (e) {
            console.error('#lockVmex:', e);
            setLoading(DEFAULT_LOADING);
            if (!String(e).includes('User rejected request'))
                toast.error('Error occured while redeeming');
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
            setLoading(DEFAULT_LOADING);
            if (!String(e).includes('User rejected request'))
                toast.error('Error occured while redeeming');
        }
    };

    const withdrawVevmex = async (e: SyntheticEvent) => {
        if (!address) return;
        const type = e.currentTarget.innerHTML?.toLowerCase();
        const typeToKey = type === 'claim' ? 'redeem' : 'earlyExit';
        try {
            setLoading({ ...loading, [typeToKey]: true });
            const prepareEarlyExit = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].vevmex as `0x${string}`,
                abi: VEVMEX_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'withdraw',
            });
            const earlyExitTx = await writeContract(prepareEarlyExit);
            await Promise.all([newTransaction(earlyExitTx), earlyExitTx.wait()]);
            setLoading({ ...loading, [typeToKey]: false });
            clearInputs && clearInputs();
        } catch (e) {
            console.error(e);
            setLoading(DEFAULT_LOADING);
            if (!String(e).includes('User rejected request'))
                toast.error('Error occured while redeeming');
        }
    };

    const dvmexDiscount = Number(queries?.[2]?.data);
    const dvmexPrice = vmexPriceInEthNoDecimals * dvmexDiscount;

    return {
        vevmexIsApproved: allowances?.[0] || BigNumber.from(0),
        redeemDvmexIsApproved: allowances?.[1] || BigNumber.from(0),
        refreshAllowances: refreshAllowances,
        vevmexRedeem,
        tokenLoading: loading,
        withdrawVevmex,
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
        dvmexDiscount: dvmexDiscount,
        dvmexPriceInEthNoDecimals: dvmexPrice,
    };
};

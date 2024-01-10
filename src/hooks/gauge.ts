import { INormalizedBN } from '@/api';
import { useTransactionsContext, useVaultsContext } from '@/store';
import { IAddress } from '@/types/wagmi';
import { CONTRACTS, DEFAULT_NORMALIZED_VALS, VMEX_VEVMEX_CHAINID, toNormalizedBN } from '@/utils';
import { VEVMEX_GAUGE_ABI, VMEX_REWARD_POOL_ABI } from '@/utils/abis';
import { prepareWriteContract, writeContract } from '@wagmi/core';
import { BigNumber, constants, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { readContracts, useAccount } from 'wagmi';

const DEFAULT_REWARDS_STATE: Record<
    'balance' | 'earned' | 'boostedBalance' | 'exitRewards' | 'boostRewards',
    INormalizedBN
> = {
    balance: DEFAULT_NORMALIZED_VALS,
    earned: DEFAULT_NORMALIZED_VALS,
    boostedBalance: DEFAULT_NORMALIZED_VALS,
    exitRewards: DEFAULT_NORMALIZED_VALS,
    boostRewards: DEFAULT_NORMALIZED_VALS,
};

export const useGauge = () => {
    const { address } = useAccount();
    const { newTransaction } = useTransactionsContext();
    const { vaults, isLoading } = useVaultsContext();
    const [selected, setSelected] = useState(vaults?.[0]?.gaugeAddress || '');
    const [gaugeRewards, setGaugeRewards] = useState(DEFAULT_REWARDS_STATE);
    const [loading, setLoading] = useState({
        redeem: false,
        rewards: false,
        boost: false,
        exit: false,
    });

    const defaultConfig = {
        address: selected as IAddress,
        abi: VEVMEX_GAUGE_ABI,
        chainId: VMEX_VEVMEX_CHAINID,
    };

    /**
     * @function redeemGaugeRewards
     */
    const redeemGaugeRewards = async () => {
        if (!address) return;
        if (!selected || !utils.isAddress(selected)) {
            console.warn('No gauge address being passed');
            toast.error('No gauge selected');
            return;
        }
        try {
            setLoading({ ...loading, redeem: true });
            const prepareRedeemTx = await prepareWriteContract({
                address: selected as IAddress,
                abi: VEVMEX_GAUGE_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'getReward',
            });
            const redeemTx = await writeContract(prepareRedeemTx);
            await Promise.all([newTransaction(redeemTx), redeemTx.wait()]);
            setLoading({ ...loading, redeem: false });
            setGaugeRewards(DEFAULT_REWARDS_STATE);
        } catch (e) {
            console.error(e);
            setLoading({ ...loading, redeem: false });
        }
    };

    /**
     * @function claimBoostRewards
     */
    const claimBoostRewards = async () => {
        if (!address) return;
        try {
            setLoading({ ...loading, boost: true });

            // TODO: mel0n - START
            const prepareClaimTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmexRewards,
                abi: VMEX_REWARD_POOL_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'claim',
            });
            const claimTx = await writeContract(prepareClaimTx);
            // mel0n - END

            await Promise.all([newTransaction(claimTx), claimTx.wait()]);
            setLoading({ ...loading, boost: false });
            setGaugeRewards({ ...gaugeRewards, boostRewards: DEFAULT_NORMALIZED_VALS });
        } catch (e) {
            console.error(e);
            setLoading({ ...loading, boost: false });
        }
    };

    /**
     * @function claimExitRewards
     */
    const claimExitRewards = async () => {
        if (!address) return;
        try {
            setLoading({ ...loading, exit: true });

            // TODO: mel0n - START
            const prepareClaimTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].dvmexRewards,
                abi: VMEX_REWARD_POOL_ABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'claim',
            });
            const claimTx = await writeContract(prepareClaimTx);
            // mel0n - END

            await Promise.all([newTransaction(claimTx), claimTx.wait()]);
            setLoading({ ...loading, exit: false });
            setGaugeRewards({ ...gaugeRewards, exitRewards: DEFAULT_NORMALIZED_VALS });
        } catch (e) {
            console.error(e);
            setLoading({ ...loading, exit: false });
        }
    };

    // Get data on load
    useEffect(() => {
        if (vaults?.length && !selected) setSelected(vaults?.[0]?.gaugeAddress);
    }, [isLoading, vaults?.length]);

    // get rewards on selected vault change
    useEffect(() => {
        (async () => {
            if (!address || !selected) return;
            setLoading({ ...loading, rewards: true });
            const gaugeRewards = await readContracts({
                contracts: [
                    {
                        ...defaultConfig,
                        functionName: 'balanceOf',
                        args: [address || constants.AddressZero],
                    },
                    {
                        ...defaultConfig,
                        functionName: 'earned',
                        args: [address || constants.AddressZero],
                    },
                    {
                        ...defaultConfig,
                        functionName: 'nextBoostedBalanceOf',
                        args: [address || constants.AddressZero],
                    },
                    {
                        ...defaultConfig,
                        functionName: 'decimals',
                    },
                    // TODO: mel0n --> using the appropriate method, grab the gauges exit and boosted rewards
                ],
            });
            const decimals = gaugeRewards[3];
            setGaugeRewards({
                balance: toNormalizedBN(gaugeRewards[0], decimals),
                earned: toNormalizedBN(gaugeRewards[1], decimals),
                boostedBalance: toNormalizedBN(gaugeRewards[2], decimals),
                exitRewards: toNormalizedBN(BigNumber.from(0)), // TODO: mel0n
                boostRewards: toNormalizedBN(BigNumber.from(0)), // TODO: mel0n
            });
            setLoading({ ...loading, rewards: false });
        })().catch((e) => console.error(e));
    }, [selected]);

    return {
        selected,
        setSelected,
        gaugeRewards,
        redeemGaugeRewards,
        gaugeLoading: loading,
        claimBoostRewards,
        claimExitRewards,
    };
};

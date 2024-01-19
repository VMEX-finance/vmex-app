import { INormalizedBN } from '@/api';
import { useTransactionsContext, useVaultsContext } from '@/store';
import { IAddress } from '@/types/wagmi';
import { getAddress } from '@ethersproject/address';
import { erc20ABI, prepareWriteContract, writeContract } from '@wagmi/core';
import { CONTRACTS, DEFAULT_NORMALIZED_VALS, VMEX_VEVMEX_CHAINID, toNormalizedBN } from '@/utils';
import { IncentivesControllerABI, VEVMEX_GAUGE_ABI } from '@/utils/abis';
import { constants, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { readContracts, useAccount } from 'wagmi';

const DEFAULT_REWARDS_STATE: Record<'balance' | 'earned' | 'boostedBalance', INormalizedBN> = {
    balance: DEFAULT_NORMALIZED_VALS,
    earned: DEFAULT_NORMALIZED_VALS,
    boostedBalance: DEFAULT_NORMALIZED_VALS,
};

export const useGauge = () => {
    const { address } = useAccount();
    const { newTransaction } = useTransactionsContext();
    const { vaults, isLoading } = useVaultsContext();
    const [selected, setSelected] = useState(vaults?.[0]?.aTokenAddress || '');
    const [gaugeRewards, setGaugeRewards] = useState(DEFAULT_REWARDS_STATE);
    const [loading, setLoading] = useState({
        redeem: false,
        rewards: false,
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
        if (
            !selected ||
            !utils.isAddress(selected) ||
            !CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController
        ) {
            console.warn('No gauge address being passed');
            toast.error('No gauge selected');
            return;
        }
        try {
            setLoading({ ...loading, redeem: true });
            const prepareRedeemTx = await prepareWriteContract({
                address: CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController,
                abi: IncentivesControllerABI,
                chainId: VMEX_VEVMEX_CHAINID,
                functionName: 'claimDVmexReward',
                args: [selected, address],
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

    // Get data on load
    useEffect(() => {
        if (vaults?.length && !selected) {
            setSelected(vaults?.[0]?.aTokenAddress);
        }
        // (async () => getBoostRewards())().catch(e => console.error(e))
    }, [isLoading, vaults?.length]);

    // get rewards on selected vault change
    useEffect(() => {
        (async () => {
            if (!address || !selected || !CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController)
                return;
            setLoading({ ...loading, rewards: true });
            const gaugeRewards = await readContracts({
                contracts: [
                    {
                        address: getAddress(selected),
                        abi: erc20ABI,
                        chainId: VMEX_VEVMEX_CHAINID,
                        functionName: 'balanceOf',
                        args: [address || constants.AddressZero],
                    },
                    {
                        address: CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController,
                        abi: IncentivesControllerABI,
                        chainId: VMEX_VEVMEX_CHAINID,
                        functionName: 'earned',
                        args: [getAddress(selected), address || constants.AddressZero],
                    },
                    {
                        address: CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController,
                        abi: IncentivesControllerABI,
                        chainId: VMEX_VEVMEX_CHAINID,
                        functionName: 'nextBoostedBalanceOf',
                        args: [getAddress(selected), address || constants.AddressZero],
                    },
                    {
                        address: CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController,
                        abi: IncentivesControllerABI,
                        chainId: VMEX_VEVMEX_CHAINID,
                        functionName: 'getDVmexReward',
                        args: [getAddress(selected)],
                    },
                ],
            });
            const decimals = gaugeRewards[3].decimals;
            setGaugeRewards({
                balance: toNormalizedBN(gaugeRewards[0], decimals),
                earned: toNormalizedBN(gaugeRewards[1], 18),
                boostedBalance: toNormalizedBN(gaugeRewards[2], 18),
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
    };
};

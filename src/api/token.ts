import { useTransactionsContext } from '@/store';
import { CONTRACTS, getChainId, getNetworkName } from '@/utils';
import { VEVMEX_OPTIONS_ABI } from '@/utils/abis';
import { useQuery } from '@tanstack/react-query';
import { erc20ABI, readContract, writeContract, prepareWriteContract } from '@wagmi/core';
import { BigNumber, utils } from 'ethers';
import { useState } from 'react';
import { useContractRead } from 'wagmi';

const getGauges = async () => {
    const chainId = getChainId();
    const factory = await readContract({
        abi: [''],
        address: CONTRACTS[5].gaugeFactory as `0x${string}`,
        args: [],
        functionName: '',
    });
    return factory;
};

export const useToken = (address?: string) => {
    const { newTransaction } = useTransactionsContext();
    const [loading, setLoading] = useState({ redeem: false, redeemApproved: false });
    const network = getNetworkName();

    const queryGauges = useQuery({
        queryKey: ['gauges', network],
        queryFn: getGauges,
    });

    const { data: vevmexIsApproved, refetch: vevmexRefreshAllowances } = useContractRead({
        address: CONTRACTS[5].vevmex as `0x${string}`,
        abi: erc20ABI,
        chainId: 5,
        functionName: 'allowance',
        args: [utils.getAddress(address || ''), '0x VEVMEX_OPTIONS_ADDRESS'], // Is second address multisig?
        // select: (value: bigint): boolean => value >= redeemAmount.raw,
        enabled: !!address,
    });

    const vevmexRedeem = async (amount: BigNumber) => {
        if (!address) return;
        const cleanAddress = utils.getAddress(address);
        if (!vevmexIsApproved) {
            setLoading({ ...loading, redeemApproved: true });
            const prepareApproveTx = await prepareWriteContract({
                address: CONTRACTS[5].vevmex as `0x${string}`,
                abi: erc20ABI,
                chainId: 5,
                functionName: 'approve',
                args: [cleanAddress, amount],
            });
            const approveTx = await writeContract(prepareApproveTx);
            setLoading({ ...loading, redeemApproved: false });
        }
        setLoading({ ...loading, redeem: true });
        const prepareRedeemTx = await prepareWriteContract({
            address: CONTRACTS[5].vevmex as `0x${string}`,
            abi: VEVMEX_OPTIONS_ABI,
            chainId: 5,
            functionName: 'redeem',
            args: [amount, cleanAddress],
        });
        const redeemTx = await writeContract(prepareRedeemTx);
        setLoading({ ...loading, redeem: false });
        await newTransaction(redeemTx);
    };

    return {
        queryGauges,
        vevmexIsApproved,
        vevmexRefreshAllowances,
        vevmexRedeem,
        tokenLoading: loading,
    };
};

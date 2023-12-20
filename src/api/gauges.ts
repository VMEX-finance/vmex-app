import { CONTRACTS, TESTING, getNetworkName, VMEX_VEVMEX_CHAINID } from '@/utils';
import { VEVMEX_GAUGE_ABI } from '@/utils/abis';
import { useQuery } from '@tanstack/react-query';
import { readContracts } from '@wagmi/core';
import { BigNumber, BigNumberish, utils } from 'ethers';
import { useEffect } from 'react';

const toNormalizedBN = (value: BigNumberish, decimals?: number) => ({
    raw: BigNumber.from(value),
    normalized: utils.formatUnits(BigNumber.from(value), decimals ?? 18),
});

const formatGauges = async (gaugeAddresses: string[]) => {
    const gaugePromises = gaugeAddresses.map(async (gaugeAddress) => {
        const results = await readContracts({
            contracts: [
                {
                    address: gaugeAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'asset',
                },
                {
                    address: gaugeAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'name',
                },
                {
                    address: gaugeAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'symbol',
                },
                {
                    address: gaugeAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'decimals',
                },
                {
                    address: gaugeAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'totalAssets',
                },
                {
                    address: gaugeAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'rewardRate',
                },
            ],
        });

        return {
            address: gaugeAddress,
            vaultAddress: results[0],
            name: results[1],
            symbol: results[2],
            decimals: results[3],
            totalStaked: toNormalizedBN(results[4], results[3]),
            rewardRate: toNormalizedBN(results[5], 18),
        };
    });

    const allGauges = await Promise.all(gaugePromises);
    return allGauges;
};

const getGauges = async () => {
    return await formatGauges(CONTRACTS[VMEX_VEVMEX_CHAINID].gauges);
};

export const useGauages = () => {
    const network = getNetworkName();

    const queryGauges = useQuery({
        queryKey: ['gauges', network],
        queryFn: getGauges,
        initialData: [],
    });

    // TODO: remove
    useEffect(() => {
        if (TESTING) {
            console.log('Available Gauges:', queryGauges.data);
        }
    }, [queryGauges.data]);

    return {
        queryGauges,
    };
};

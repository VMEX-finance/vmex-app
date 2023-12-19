import { VMEX_VEVMEX_CHAINID } from '@/hooks';
import { CONTRACTS, getNetworkName } from '@/utils';
import { VEVMEX_GAUGE_ABI } from '@/utils/abis';
import { decodeAsAddress, decodeAsBigInt, decodeAsNumber, decodeAsString } from '@/utils/decode';
import { useQuery } from '@tanstack/react-query';
import { readContracts } from '@wagmi/core';
import { BigNumber, BigNumberish, utils } from 'ethers';

const toNormalizedBN = (value: BigNumberish, decimals?: number) => ({
    raw: BigNumber.from(value),
    normalized: utils.formatUnits(BigNumber.from(value), decimals ?? 18),
});

const formatVaults = async (vaultsAddresses: string[]) => {
    const gaugePromises = vaultsAddresses.map(async (vaultAddress) => {
        const results: any[] = await readContracts({
            contracts: [
                {
                    address: vaultAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'asset',
                },
                {
                    address: vaultAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'name',
                },
                {
                    address: vaultAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'symbol',
                },
                {
                    address: vaultAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'decimals',
                },
                {
                    address: vaultAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'totalAssets',
                },
                {
                    address: vaultAddress as `0x${string}`,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'rewardRate',
                },
            ],
        });
        console.log('Results:', results);
        const decimals = Number(decodeAsBigInt(results[3])) || decodeAsNumber(results[3]);
        const totalAssets = toNormalizedBN(decodeAsBigInt(results[4]), decimals);
        const rewardRate = toNormalizedBN(decodeAsBigInt(results[5]), 18);

        return {
            address: vaultAddress,
            vaultAddress: decodeAsAddress(results[0]),
            name: decodeAsString(results[1]),
            symbol: decodeAsString(results[2]),
            decimals: decimals,
            totalStaked: totalAssets,
            rewardRate,
        };
    });

    const allGauges = await Promise.all(gaugePromises);
    return allGauges;
};

const getVaults = async () => {
    return await formatVaults(CONTRACTS[VMEX_VEVMEX_CHAINID].gauges);
};

export const useVaults = () => {
    const network = getNetworkName();

    const queryVaults = useQuery({
        queryKey: ['vaults', network],
        queryFn: getVaults,
    });

    console.log('Available Vaults:', queryVaults.data);

    return {
        queryVaults,
    };
};

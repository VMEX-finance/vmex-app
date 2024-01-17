import { CONTRACTS, TESTING, getNetworkName, VMEX_VEVMEX_CHAINID, LOGS } from '@/utils';
import { IncentivesControllerABI, VEVMEX_GAUGE_ABI, VEVMEX_REGISTRY_ABI } from '@/utils/abis';
import { useQuery } from '@tanstack/react-query';
import { Address, readContract, readContracts } from '@wagmi/core';
import { BigNumber, BigNumberish, utils } from 'ethers';
import { getAddress } from 'ethers/lib/utils.js';
import { useEffect } from 'react';

const toNormalizedBN = (value: BigNumberish, decimals?: number) => ({
    raw: BigNumber.from(value),
    normalized: utils.formatUnits(BigNumber.from(value), decimals ?? 18),
});

const formatGauges = async (gaugeAddresses: Address[]) => {
    const gaugePromises = gaugeAddresses.map(async (gaugeAddress) => {
        const results = await readContracts({
            contracts: [
                {
                    address: gaugeAddress,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'asset',
                },
                {
                    address: gaugeAddress,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'name',
                },
                {
                    address: gaugeAddress,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'symbol',
                },
                {
                    address: gaugeAddress,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'decimals',
                },
                {
                    address: gaugeAddress,
                    abi: VEVMEX_GAUGE_ABI,
                    chainId: VMEX_VEVMEX_CHAINID,
                    functionName: 'totalAssets',
                },
                {
                    address: gaugeAddress,
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
            rewardRate: toNormalizedBN(results[5], results[3]),
        };
    });

    const allGauges = await Promise.all(gaugePromises);
    return allGauges;
};

const getGauges = async (aTokens: string[]) => {
    console.log('ohhhh im getgauging', aTokens);
    const incentivesControllerAddress = CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController;
    if (!incentivesControllerAddress) return;

    const contracts = aTokens.map((x) => {
        return {
            address: incentivesControllerAddress,
            abi: IncentivesControllerABI,
            functionName: 'getDVmexReward',
            args: [x],
        };
    });
    const gaugesDetails = await readContracts({
        contracts,
    });

    console.log(gaugesDetails);

    // return gaugesDetails as
};

export const useGauges = (aTokens: string[]) => {
    const network = getNetworkName();

    const queryGauges = useQuery(
        ['gauges', network, ...aTokens], // Query Key: an array including your params
        () => getGauges(aTokens),
    );

    // TODO: remove
    useEffect(() => {
        if (LOGS) {
            console.log('Gauges:', queryGauges.data);
        }
    }, [queryGauges.data]);

    return {
        queryGauges,
    };
};

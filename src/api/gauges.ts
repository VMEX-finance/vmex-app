import { CONTRACTS, getNetworkName, VMEX_VEVMEX_CHAINID, LOGS } from '@/utils';
import { IncentivesControllerABI } from '@/utils/abis';
import { useQuery } from '@tanstack/react-query';
import { readContracts } from '@wagmi/core';
import { BigNumber, BigNumberish, utils } from 'ethers';
import { IGaugesAsset, IMarketsAsset } from './types';
import { parseUnits } from 'viem';

const toNormalizedBN = (value: BigNumberish, decimals?: number) => ({
    raw: BigNumber.from(value),
    normalized: utils.formatUnits(BigNumber.from(value), decimals ?? 18),
});

type DVmexReward = {
    aToken: string;
    periodFinish: number;
    lastUpdateTime: number;
    rewardRate: BigNumber;
    rewardPerTokenStored: BigNumber;
    decimals: number;
    queuedRewards: BigNumber;
    currentRewards: BigNumber;
};

const getGauges = async (marketData: IMarketsAsset[]): Promise<IGaugesAsset[]> => {
    const aTokens = marketData.map((x) => x.aTokenAddress);
    const incentivesControllerAddress = CONTRACTS[VMEX_VEVMEX_CHAINID].incentivesController;

    if (!incentivesControllerAddress || !aTokens.length) return [];

    const gaugesDetails = (await readContracts({
        contracts: aTokens.map((x) => {
            return {
                address: incentivesControllerAddress,
                abi: IncentivesControllerABI,
                functionName: 'getDVmexReward',
                args: [x],
            };
        }),
    })) as DVmexReward[];

    const gaugesFormatted = [];
    for (const i in Object.entries(gaugesDetails)) {
        if (gaugesDetails[i].periodFinish == 0) continue;
        const suppliedNative = parseUnits(
            marketData[i].supplyTotalNative,
            gaugesDetails[i].decimals,
        );

        gaugesFormatted.push({
            address: aTokens[i],
            name: `${marketData[i].asset}:${marketData[i].tranche}`,
            symbol: `vG-v${marketData[i].asset}:${marketData[i].trancheId}`,
            totalStaked: toNormalizedBN(suppliedNative, gaugesDetails[i].decimals),
            rewardRate: toNormalizedBN(gaugesDetails[i].rewardRate, 18),
            periodFinish: gaugesDetails[i].periodFinish,
            decimals: gaugesDetails[i].decimals,
            underlyingAsset: marketData[i].asset,
        });
    }

    return gaugesFormatted;
};

export const useGauges = (marketData: IMarketsAsset[]) => {
    const network = getNetworkName();

    const queryGauges = useQuery(
        ['gauges', network, marketData.map((x) => x.aTokenAddress).length.toString()], // Query Key: an array including your params
        () => getGauges(marketData),
    );

    return {
        queryGauges,
    };
};

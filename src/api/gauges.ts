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
    console.log(
        'getgauges',
        VMEX_VEVMEX_CHAINID,
        incentivesControllerAddress,
        marketData.length,
        aTokens.length,
        !incentivesControllerAddress || !aTokens.length,
    );
    if (!incentivesControllerAddress || !aTokens.length) return [];
    console.log('WTF IS HAPPENIN');
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

    console.log('getgautes', gaugesDetails);

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
            symbol: `${marketData[i].asset}:${marketData[i].tranche}`,
            totalStaked: toNormalizedBN(suppliedNative, gaugesDetails[i].decimals),
            rewardRate: toNormalizedBN(gaugesDetails[i].rewardRate, 18),
            periodFinish: gaugesDetails[i].periodFinish,
            decimals: gaugesDetails[i].decimals,
        });
    }
    console.log('getgauges result', gaugesFormatted);

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

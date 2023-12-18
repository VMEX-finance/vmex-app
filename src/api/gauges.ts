import { CONTRACTS, getChainId, getNetworkName } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';

const getGauges = async () => {
    const chainId = getChainId();
    const factory = await readContract({
        abi: ['function getVaults() view returns (address[])'],
        address: CONTRACTS[5].registery as `0x${string}`,
        args: [],
        functionName: 'getVaults',
        chainId: 5,
    });
    return factory;
};

export const useGauages = () => {
    const network = getNetworkName();

    const queryGauges = useQuery({
        queryKey: ['gauges', network],
        queryFn: getGauges,
    });

    return {
        queryGauges,
    };
};

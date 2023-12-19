import { CONTRACTS, getChainId, getNetworkName } from '@/utils';
import { VEVMEX_GAUGE_ABI } from '@/utils/abis';
import { useQuery } from '@tanstack/react-query';
import { readContract, readContracts } from '@wagmi/core';

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

// const formatGauge = async (gaugeAddresses: string[]) => {
//     const gaugesConfig = gaugeAddresses.map(g => ({
//         address: g as `0x${string}`,
//         abi: VEVMEX_GAUGE_ABI,
//         functionName: ''
//     }))
//     const gauges = await readContracts({
//         contracts: [
//             {
//                 address: gaugeAddresses[0] as `0x${string}`,
//                 abi: VEVMEX_GAUGE_ABI,
//                 functionName: ''
//             }
//         ]
//     })
// }

export const useGauages = () => {
    const network = getNetworkName();

    const queryGauges = useQuery({
        queryKey: ['gauges', network],
        queryFn: getGauges,
    });

    console.log('Available Gauges:', queryGauges.data);

    return {
        queryGauges,
    };
};

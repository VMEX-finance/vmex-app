import { useQuery } from '@tanstack/react-query';
import { nativeTokenFormatter, NETWORKS, DEFAULT_NETWORK } from '@/utils';
import { formatUnits } from 'ethers/lib/utils.js';
import { getNetwork } from '@wagmi/core';

// Gets
export async function getUserRewards(userAddress: string) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    if (!userAddress) {
        return [];
    }
    const res = await (
        await fetch(`${NETWORKS[network].backend}/v1/user/rewards/${userAddress}`)
    ).json();
    const formattedArr: any[] = [];
    for (const token in res) {
        const asset = res[token].tokenInfo.symbol || token;
        const decimals = res[token].tokenInfo.decimals || 18;
        const amountNative = nativeTokenFormatter.format(
            parseFloat(formatUnits(`0x${res[token].amount}`, decimals)),
        );

        formattedArr.push({
            token,
            asset,
            amountNative,
            proof: res[token].proof,
            amountWei: `0x${res[token].amount}`,
            chainId: res[token].chainId,
        });
    }
    return formattedArr;
}

// Master
export function useUserRewards(userAddress: any) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const queryUserRewards = useQuery({
        queryKey: [`user-external-rewards`, userAddress, network],
        queryFn: () => getUserRewards(userAddress),
        enabled: !!userAddress,
    });

    return {
        queryUserRewards,
    };
}

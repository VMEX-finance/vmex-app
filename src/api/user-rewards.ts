import { useQuery } from '@tanstack/react-query';
import { nativeTokenFormatter, NETWORKS, getNetworkName } from '@/utils';
import { formatUnits } from 'ethers/lib/utils.js';

// Gets
export async function getUserRewards(userAddress: string) {
    const network = getNetworkName();
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
        const claimableAmountNative = nativeTokenFormatter.format(
            parseFloat(formatUnits(`0x${res[token].claimable}`, decimals)),
        );

        formattedArr.push({
            token,
            asset,
            amountNative,
            claimableAmountNative,
            proof: res[token].proof,
            amountWei: `0x${res[token].amount}`,
            claimableAmountWei: `0x${res[token].claimable}`,
            chainId: res[token].chainId,
        });
    }
    return formattedArr;
}

// Master
export function useUserRewards(userAddress: any) {
    const network = getNetworkName();

    const queryUserRewards = useQuery({
        queryKey: [`user-external-rewards`, userAddress, network],
        queryFn: () => getUserRewards(userAddress),
        enabled: !!userAddress,
    });

    return {
        queryUserRewards,
    };
}

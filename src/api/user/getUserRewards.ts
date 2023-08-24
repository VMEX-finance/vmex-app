import { useQuery } from '@tanstack/react-query';
import { USER_REWARDS_URL } from '../../utils/constants';
import { nativeTokenFormatter } from '../../utils';
import { formatUnits } from 'ethers/lib/utils.js';

// Gets
export async function getUserRewards(userAddress: string) {
    if (!userAddress) {
        return [];
    }
    const res = await (
        await fetch(`${USER_REWARDS_URL['production']}/v1/user/rewards/${userAddress}`)
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
        });
    }
    return formattedArr;
}

// Master
export function useUserRewards(userAddress: any) {
    const queryUserRewards = useQuery({
        queryKey: [`user-external-rewards-${userAddress}`],
        queryFn: () => getUserRewards(userAddress),
        enabled: !!userAddress,
    });

    return {
        queryUserRewards,
    };
}

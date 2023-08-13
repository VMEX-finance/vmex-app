import { useQuery } from '@tanstack/react-query';
import { USER_REWARDS_URL } from '../../utils/constants';
import {
    SDK_PARAMS,
    bigNumberToNative,
    bigNumberToUSD,
    bigNumberToUnformattedString,
} from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';
import { convertAddressToSymbol } from '@vmexfinance/sdk';

// Gets
export async function getUserRewards(userAddress: string) {
    if (!userAddress) {
        return [];
    }

    const res = await (await fetch(`${USER_REWARDS_URL}/v1/user/rewards/${userAddress}`)).json();
    if (res) {
        const formattedArr: any[] = [];
        for (let [key, value] of Object.entries(res)) {
            const asset = convertAddressToSymbol(key, SDK_PARAMS.network) || key;
            const amountNative = bigNumberToNative(
                BigNumber.from(`0x${(value as any).amount}`),
                asset,
            );
            const amountUsd = bigNumberToUSD(BigNumber.from(`0x${(value as any).amount}`), 18);
            formattedArr.push({ asset, amountNative, amountUsd });
        }
        return formattedArr;
    }
    return [];
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

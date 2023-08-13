import { useQuery } from '@tanstack/react-query';
import { USER_REWARDS_URL } from '../../utils/constants';
import {
    DECIMALS,
    SDK_PARAMS,
    bigNumberToNative,
    nativeAmountToUSD,
} from '../../utils/sdk-helpers';
import { BigNumber } from 'ethers';
import { convertAddressToSymbol } from '@vmexfinance/sdk';

// Gets
export async function getUserRewards(userAddress: string, assetPrices: any) {
    if (!userAddress) {
        return [];
    }
    const res = await (
        await fetch(
            `${USER_REWARDS_URL}/v1/user/rewards/0x170bB74C6e143C0b2caB5fa3ef37C7212C993F62`,
        )
    ).json();
    if (res && assetPrices) {
        const priceMapping = new Map();
        Object.keys(assetPrices).forEach((key) => {
            priceMapping.set(key, assetPrices[key].usdPrice);
        });

        const formattedArr: any[] = [];
        for (let [key, value] of Object.entries(res)) {
            const asset = convertAddressToSymbol(key, SDK_PARAMS.network) || key;
            const decimals = DECIMALS.get(asset) || 18;

            const amountNative = bigNumberToNative(
                BigNumber.from(`0x${(value as any).amount}`),
                asset,
            );
            const amountUsd = nativeAmountToUSD(
                BigNumber.from(`0x${(value as any).amount}`),
                decimals,
                priceMapping.get(asset) || BigNumber.from('0'),
            );

            formattedArr.push({ asset, amountNative, amountUsd });
        }
        return formattedArr;
    }
    return [];
}

// Master
export function useUserRewards(userAddress: any, prices: any) {
    const queryUserRewards = useQuery({
        queryKey: [`user-external-rewards-${userAddress}`],
        queryFn: () => getUserRewards(userAddress, prices),
        enabled: !!userAddress && !!prices,
    });

    return {
        queryUserRewards,
    };
}

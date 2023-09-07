import { useQuery } from '@tanstack/react-query';
import { NETWORKS, DEFAULT_NETWORK } from '../../utils';
import { getNetwork } from '@wagmi/core';
import { ethers } from 'ethers';

// Gets
export async function getUserReferrals(userAddress: string) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    if (!userAddress) {
        return 0;
    }
    const res = await (
        await fetch(`${NETWORKS[network].backend}/v1/user/referrals/${userAddress}`)
    ).json();

    return res?.referrals || 0;
}

// Gets
export async function addUserReferral(userAddress?: string, referredAddress?: string) {
    if (!userAddress) return { isSuccess: false, message: 'Missing user address' };
    if (!ethers.utils.isAddress(userAddress))
        return { isSuccess: false, message: 'User address is not a valid address' };

    if (!referredAddress) return { isSuccess: false, message: 'Missing referral address' };
    if (!ethers.utils.isAddress(referredAddress))
        return { isSuccess: false, message: 'Referral address is not a valid address' };

    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const res = await fetch(`${NETWORKS[network].backend}/v1/user/referrals/${referredAddress}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            referred: userAddress,
        }),
    });
    if (res.status === 200) return { isSuccess: true, message: 'Success' };
    return { isSuccess: false, message: (await res.text()) || 'Error adding referral' };
}

// Master
export function useUserReferrals(userAddress: any) {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const queryUserReferrals = useQuery({
        queryKey: [`user-referrals`, userAddress, network],
        queryFn: () => getUserReferrals(userAddress),
        enabled: !!userAddress,
    });

    return {
        queryUserReferrals,
        addUserReferral,
    };
}
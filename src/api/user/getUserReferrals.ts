import { useQuery } from '@tanstack/react-query';
import { NETWORKS, DEFAULT_NETWORK } from '../../utils';
import { getNetwork } from '@wagmi/core';

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
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    if (!userAddress || !referredAddress) {
        return false;
    }

    const res = await (
        await fetch(`${NETWORKS[network].backend}/v1/user/referrals/${userAddress}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                referred: referredAddress,
            }),
        })
    ).json();
    console.log(res);
    return res || false;
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

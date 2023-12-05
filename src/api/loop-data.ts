import { useQuery } from '@tanstack/react-query';
import { NETWORKS, bigNumberToNative, getDecimals, getNetworkName, toSymbol } from '@/utils';
import { IUserLoopingProps } from './types';
import { getUserLoopingQuery } from './queries/user-looping';
import { utils } from 'ethers';

async function formatUserLooping(network: string, loops?: IUserLoopingProps[]) {
    if (!loops?.length) return [];
    const returnList: any[] = [];
    await Promise.all(
        loops?.map(async (userLoop) => {
            await Promise.all(
                userLoop.depositedAssets.map(async (dAss, i) => {
                    returnList.push({
                        user: userLoop.id,
                        borrowAsset: toSymbol(userLoop.borrowedAssets[i]),
                        borrowAssetAddress: userLoop.borrowedAssets[i],
                        borrowAmountNative: bigNumberToNative(
                            userLoop.borrowedAmounts[i],
                            userLoop.borrowedAssets[i],
                        ),
                        depositAsset: toSymbol(dAss),
                        depositAssetAddress: dAss,
                        depositAmountNative: bigNumberToNative(userLoop.depositedAmounts[i], dAss),
                    });
                }),
            );
        }),
    );
    return returnList;
}

async function _getUserLooping(
    network: string,
    userAddress?: string,
): Promise<IUserLoopingProps[]> {
    const query = getUserLoopingQuery(userAddress);
    const networkConfig = NETWORKS[network];
    const responseRaw = await fetch(networkConfig.subgraph, {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { 'Content-Type': 'application/json' },
    });

    let returnList: IUserLoopingProps[];
    const response = await responseRaw.json();
    if (response.data?.userLoopings?.length) {
        const {
            data: { userLoopings },
        }: { data: { userLoopings: IUserLoopingProps[] } } = response;
        if (userAddress) {
            const foundUser = userLoopings.find(
                (el: any) => el.id.toLowerCase() === userAddress.toLowerCase(),
            );
            if (foundUser) returnList = [foundUser];
            else returnList = userLoopings;
        } else returnList = userLoopings;
        return await formatUserLooping(network, returnList);
    }
    return [];
}

// Master
export function useLoopData(userAddress?: string) {
    const network = getNetworkName();

    const queryUserLooping = useQuery({
        queryKey: ['user-loopings', network, userAddress],
        queryFn: () => _getUserLooping(network, userAddress),
        refetchInterval: 5000,
    });

    return {
        queryUserLooping,
    };
}

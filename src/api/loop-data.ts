import { useQuery } from '@tanstack/react-query';
import { NETWORKS, bigNumberToNative, getNetworkName, isAddressEqual, toSymbol } from '@/utils';
import { IFormattedUserLoopingProps, IUserLoopingProps } from './types';
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
): Promise<IFormattedUserLoopingProps[]> {
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
        refetchInterval: 1000 * 5,
    });

    const findLoop = (address: string) => {
        if (!address) return;
        if (!utils.isAddress(address)) {
            console.warn('#findLoop: not passing an address', address);
            return;
        }
        const foundUserLoop = queryUserLooping.data?.find((loop) =>
            isAddressEqual(loop.depositAssetAddress, utils.getAddress(address)),
        );
        return foundUserLoop;
    };

    return {
        queryUserLooping,
        findLoop,
    };
}

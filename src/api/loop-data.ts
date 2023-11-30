import { useQuery } from '@tanstack/react-query';
import {
    DECIMALS,
    NETWORKS,
    PRICING_DECIMALS,
    bigNumberToUSD,
    getDecimals,
    getNetworkName,
    toAddress,
    toSymbol,
} from '@/utils';
import { IUserLoopingProps } from './types';
import { getUserLoopingQuery } from './queries/user-looping';
import { utils } from 'ethers';

async function formatUserLooping(
    network: string,
    loops?: IUserLoopingProps[],
    userAddress?: string,
) {
    if (!loops?.length) return [];
    const returnList = [];
    const renderKey = (i: number) => {
        switch (i) {
            case 0:
                return 'id';
            case 1:
                return 'depositAsset';
            case 2:
                return 'depositAmount';
            case 3:
                return 'borrowAsset';
            case 4:
                return 'borrowAmount';
        }
    };
    return await Promise.all(
        loops?.map(async (userLoop) => {
            return {
                ...userLoop,
                depositedAssets: userLoop.depositedAssets?.map((dAss) => toSymbol(dAss)),
                depositedAmounts: userLoop?.depositedAssets?.length
                    ? await Promise.all(
                          userLoop.depositedAmounts?.map(async (dAmo, i) => {
                              const decimals = await getDecimals(
                                  userLoop?.depositedAssets[i],
                                  network,
                              );
                              return {
                                  native: utils.formatUnits(dAmo, decimals),
                                  usd: bigNumberToUSD(dAmo, decimals, false),
                              };
                          }),
                      )
                    : [],
                borrowedAssets: userLoop.borrowedAssets?.map((bAss) => toSymbol(bAss)),
                borrowedAmounts: userLoop?.borrowedAssets?.length
                    ? await Promise.all(
                          userLoop.borrowedAmounts?.map(async (bAmo, i) => {
                              const decimals = await getDecimals(
                                  userLoop?.borrowedAssets[i],
                                  network,
                              );
                              const native = utils.formatUnits(bAmo, decimals);
                              return {
                                  native,
                                  usd: bigNumberToUSD(bAmo, decimals, false),
                              };
                          }),
                      )
                    : [],
            };
        }),
    );
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

    const response = await responseRaw.json();
    if (response.data?.userLoopings?.length) {
        const {
            data: { userLoopings },
        }: { data: { userLoopings: IUserLoopingProps[] } } = response;
        if (userAddress) {
            const foundUser = userLoopings.find(
                (el: any) => el.id.toLowerCase() === userAddress.toLowerCase(),
            );
            if (foundUser) return [foundUser];
            return userLoopings;
        }
        return userLoopings;
    }
    return [
        {
            depositedAssets: [],
            depositedAmounts: [],
            borrowedAssets: [],
            borrowedAmounts: [],
            id: '',
        },
    ];
}

// Master
export function useLoopData(userAddress?: string) {
    const network = getNetworkName();

    const queryUserLooping = useQuery({
        queryKey: ['user-loopings', network, userAddress],
        queryFn: () => _getUserLooping(network, userAddress),
        refetchInterval: 5000,
    });

    (async () => {
        console.log('user looping', await formatUserLooping(network, queryUserLooping.data));
    })();

    return {
        queryUserLooping,
    };
}

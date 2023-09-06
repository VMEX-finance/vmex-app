import { useQuery } from '@tanstack/react-query';
import { convertAddressToSymbol } from '@vmexfinance/sdk';
import { NETWORKS, DEFAULT_NETWORK, getContractMetadata } from '../../utils';
import { IAssetApyProps, IAssetApyQueryProps } from './types';
import { getNetwork } from '@wagmi/core';
import { ethers } from 'ethers';

export async function getAllAssetApys(): Promise<
    { assetAddress: string; assetSymbol?: string; totalApy: number; rewards: IAssetApyProps[] }[]
> {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const res = await fetch(`${NETWORKS[network].backend}/v1/reward/apy`);
    if (res.status !== 200) return [];

    const { apy, tokenDetails }: { apy: any[]; tokenDetails: any[] } = await res.json();
    const returnObj: IAssetApyProps[] = [];

    apy.forEach((el) => {
        if (el?.vault) {
            el.apysByToken.forEach((vt: any) => {
                returnObj.push({
                    assetAddress: vt.token,
                    assetSymbol: convertAddressToSymbol(vt.token, network),
                    vaultAddress: el.vault,
                    vaultName: '',
                    apy: vt.apy,
                });
            });
        }
    });
    const withVaultNames = await Promise.all(
        returnObj.map(async (el) => {
            const vaultName = await getContractMetadata(
                el.vaultAddress,
                new ethers.providers.JsonRpcProvider(NETWORKS[network].rpc),
                'name',
            );
            const assetSymbol = el?.assetSymbol
                ? el.assetSymbol
                : await getContractMetadata(
                      el.assetAddress,
                      new ethers.providers.JsonRpcProvider(NETWORKS[network].rpc),
                      'symbol',
                  );
            return {
                ...el,
                assetSymbol,
                vaultName,
            };
        }),
    );
    const tempObj = withVaultNames.reduce((acc: any, curr: any) => {
        if (curr.assetAddress in acc) {
            acc[curr.assetAddress].push(curr);
        } else {
            acc[curr.assetAddress] = [curr];
        }
        return acc;
    }, {});
    const reorganized = Object.keys(tempObj).map((key) => ({
        assetSymbol: convertAddressToSymbol(key, network),
        assetAddress: key,
        totalApy: tempObj[key].reduce(
            (a: any, b: any) => parseFloat(a?.apy || '0') + parseFloat(b?.apy || '0'),
        ),
        rewards: tempObj[key],
    }));
    return reorganized;
}

export function useApyData(): IAssetApyQueryProps {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    const queryAssetApys = useQuery({
        queryKey: ['asset-apys', network],
        queryFn: getAllAssetApys,
        refetchInterval: 60000 * 2, // refetch prices every 2 minutes
    });

    return {
        apys: queryAssetApys.data,
        ...queryAssetApys,
    };
}

import { useQuery } from '@tanstack/react-query';
import { NETWORKS, DEFAULT_NETWORK, findInObjArr, getContractMetadata } from '@/utils';
import { IAssetApyProps } from './types';
import { getNetwork } from '@wagmi/core';
import { convertAddressToSymbol } from '@vmexfinance/sdk';
import { ethers } from 'ethers';

export async function getAllAssetApys() {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
    const provider = new ethers.providers.JsonRpcProvider(NETWORKS[network].rpc);

    const res = await fetch(`${NETWORKS[network].backend}/v1/reward/apy`);
    if (res.status !== 200) return [];

    const { apy, tokenDetails }: { apy: any[]; tokenDetails: any[] } = await res.json();

    const formattedApy: IAssetApyProps[] = apy?.length
        ? await Promise.all(
              apy.map(async (a) => {
                  const found = findInObjArr('address', a.asset, tokenDetails);
                  const apysByToken: any[] = [];
                  if (a?.apysByToken) {
                      a.apysByToken.forEach(async (t: any) => {
                          if (t.name) {
                              apysByToken.push({
                                  apy: t.apy,
                                  symbol: t.name,
                                  name: t.name,
                              });
                          } else {
                              const foundVaultToken = findInObjArr(
                                  'address',
                                  t.token,
                                  tokenDetails,
                              );
                              apysByToken.push({
                                  asset: t.token,
                                  apy: t.apy,
                                  symbol: foundVaultToken
                                      ? foundVaultToken.symbol
                                      : convertAddressToSymbol(t.token, network) ||
                                        (await getContractMetadata(t.token, provider, 'symbol')),
                                  name: foundVaultToken?.name || '',
                              });
                          }
                      });
                  }
                  return {
                      ...a,
                      symbol: found
                          ? found.symbol
                          : convertAddressToSymbol(a.asset, network) ||
                            (await getContractMetadata(a.asset, provider, 'symbol')),
                      name: found?.name || '',
                      apysByToken,
                      description: found?.description || '',
                  };
              }),
          )
        : [];
    return formattedApy;
}

export function useApyData() {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
    const queryAssetApys = useQuery({
        queryKey: ['asset-apys', network],
        queryFn: getAllAssetApys,
        refetchInterval: 60000 * 2, // refetch prices every 2 minutes
    });

    return { queryAssetApys };
}

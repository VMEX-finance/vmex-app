import { useQuery } from '@tanstack/react-query';
import { CONTRACTS, NETWORKS, VMEX_VEVMEX_CHAINID, getNetworkName } from '@/utils';
import { IAssetApyProps } from './types';
import { convertAddressToSymbol } from '@vmexfinance/sdk';
import { useVaultsContext } from '@/store';
import { useEffect, useMemo } from 'react';

export async function getAllAssetApys(): Promise<IAssetApyProps[]> {
    const network = getNetworkName();
    try {
        const res = await fetch(`${NETWORKS[network].backend}/v1/reward/apy`);
        if (res.status !== 200) return [];

        const { apy, tokenDetails }: { apy: any[]; tokenDetails: any[] } = await res.json();
        if (!apy?.length) return [];

        return await Promise.all(
            apy.map(async (a) => {
                const found = tokenDetails.find(
                    (x) => x.address.toLowerCase() === a.asset.toLowerCase(),
                );
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
                            const foundVaultToken = tokenDetails.find(
                                (x) => x.address.toLowerCase() === t.token.toLowerCase(),
                            );
                            apysByToken.push({
                                asset: t.token,
                                apy: t.apy,
                                symbol: foundVaultToken
                                    ? foundVaultToken.symbol
                                    : convertAddressToSymbol(t.token, network),
                                name: foundVaultToken?.name || '',
                            });
                        }
                    });
                }
                return {
                    ...a,
                    symbol: found ? found.symbol : convertAddressToSymbol(a.asset, network),
                    name: found?.name || '',
                    apysByToken,
                    description: found?.description || '',
                };
            }),
        );
    } catch (error) {
        console.error('Error fetching APY:', error);
        return [];
    }
}

export function useApyData() {
    const queryAssetApys = useQuery({
        queryKey: ['asset-apys', getNetworkName()],
        queryFn: getAllAssetApys,
        refetchInterval: 1000 * 60 * 5, // refetch apys every 5 minutes
    });
    // const { vaults } = useVaultsContext();

    // const returnData = useMemo(() => {
    //     if(vaults.length && queryAssetApys.data?.length) {
    //         queryAssetApys.data.map((assetApy) => {
    //             const _apysByToken = [];
    //             let _total = 0;
    //             // Look in vaults for juicy APY
    //             console.log("asset apy", assetApy)
    //             const foundInVault = vaults?.find((v) => v.underlyingAddress?.toLowerCase() === assetApy.asset?.toLowerCase());
    //             if(foundInVault) {
    //                 console.log("found", foundInVault)
    //                 const realAPR = Number(foundInVault.gaugeAPR) * 100;
    //                 _apysByToken.push({ apy: String(realAPR), asset: CONTRACTS[VMEX_VEVMEX_CHAINID].vmex, name: 'VMEX Finance', symbol: 'VMEX' });
    //                 _total = _total + realAPR;
    //             }
    //                 if(assetApy?.apysByToken?.length) {
    //                     _apysByToken.push(...assetApy.apysByToken);
    //                     _total = _total + Number(assetApy.totalApy);
    //                 }
    //             return {
    //                 ...assetApy,
    //                 totalApy: String(_total),
    //                 apysByToken: _apysByToken
    //             }
    //         })
    //     }
    //     return queryAssetApys.data;
    // }, [vaults.length, queryAssetApys.data?.length])

    return { queryAssetApys };
}

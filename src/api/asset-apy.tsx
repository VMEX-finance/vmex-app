import { useQuery } from '@tanstack/react-query';
import { NETWORKS, getNetworkName } from '@/utils';
import { IAssetApyProps } from './types';
import { convertAddressToSymbol } from '@vmexfinance/sdk';

export async function getAllAssetApys(): Promise<IAssetApyProps[]> {
    const network = getNetworkName();

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
}

export function useApyData() {
    const queryAssetApys = useQuery({
        queryKey: ['asset-apys', getNetworkName()],
        queryFn: getAllAssetApys,
        refetchInterval: 60000 * 2, // refetch prices every 2 minutes
    });

    return { queryAssetApys };
}

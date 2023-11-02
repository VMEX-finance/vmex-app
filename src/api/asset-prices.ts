import { useQuery } from '@tanstack/react-query';
import { getAssetPrices, getAllAssetSymbols, convertAddressToSymbol } from '@vmexfinance/sdk';
import { NETWORKS, IAvailableCoins, getNetworkName } from '@/utils';
import { IAssetPricesProps, IPricesDataProps } from './types';

export async function getAllAssetPrices(): Promise<
    Record<IAvailableCoins | any, IAssetPricesProps>
> {
    try {
        const network = getNetworkName();
        const pricesMap = await getAssetPrices({
            assets: getAllAssetSymbols(network),
            network,
            test: NETWORKS[network].testing,
            providerRpc: NETWORKS[network].rpc,
        });
        const returnObj: Record<string, IAssetPricesProps> = {};
        pricesMap &&
            pricesMap.forEach(({ oracle, priceETH, priceUSD }, key) => {
                let asset = convertAddressToSymbol(key, network);
                asset = asset.toUpperCase();
                (returnObj as any)[asset] = {
                    oracle,
                    ethPrice: priceETH,
                    usdPrice: priceUSD, //bignumber
                };
            });

        return returnObj;
    } catch (err) {
        console.log('#getAllAssetPrices:', err);
        return {};
    }
}

export function usePricesData(): IPricesDataProps {
    const queryAssetPrices = useQuery({
        queryKey: ['asset-prices', getNetworkName()],
        queryFn: getAllAssetPrices,
        refetchInterval: 60000, // refetch prices every minute
    });

    return {
        prices: queryAssetPrices.data,
        isLoading: queryAssetPrices.isLoading,
        isError: queryAssetPrices.isError,
    };
}

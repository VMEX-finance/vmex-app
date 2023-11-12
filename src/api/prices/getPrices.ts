import { useQuery } from '@tanstack/react-query';
import { getAssetPrices, getAllAssetSymbols, convertAddressToSymbol } from '@vmexfinance/sdk';
import { NETWORKS, DEFAULT_NETWORK, IAvailableCoins } from '@/utils';
import { IAssetPricesProps, IPricesDataProps } from './types';
import { getNetwork } from '@wagmi/core';

export async function getAllAssetPrices(): Promise<
    Record<IAvailableCoins | any, IAssetPricesProps>
> {
    try {
        const network = getNetwork()?.chain?.unsupported
            ? DEFAULT_NETWORK
            : getNetwork()?.chain?.network || DEFAULT_NETWORK;
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
        console.error('#getAllAssetPrices:', err);
        return {};
    }
}

export function usePricesData(): IPricesDataProps {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
    const queryAssetPrices = useQuery({
        queryKey: ['asset-prices', network],
        queryFn: getAllAssetPrices,
        refetchInterval: 60000, // refetch prices every minute
    });
    const getErroredAssets = () => {
        const returnArr: string[] = [];
        Object.entries(queryAssetPrices.data || {}).forEach(([key, val]) => {
            if (val.ethPrice.toString() === '0' && val.ethPrice.toString() === '0')
                returnArr.push(key);
        });
        return returnArr;
    };

    return {
        prices: queryAssetPrices.data,
        isLoading: queryAssetPrices.isLoading,
        isError: queryAssetPrices.isError || JSON.stringify(queryAssetPrices.data) === '{}',
        errorAssets: getErroredAssets(),
    };
}

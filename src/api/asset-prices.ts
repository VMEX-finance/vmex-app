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
        console.error('#getAllAssetPrices:', String(err).split('[')[0]);
        return {};
    }
}

export function usePricesData(): IPricesDataProps {
    const queryAssetPrices = useQuery({
        queryKey: ['asset-prices', getNetworkName()],
        queryFn: getAllAssetPrices,
        refetchInterval: 1000 * 60 * 5, // refetch apys every 5 minutes
        retryDelay: 1000,
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

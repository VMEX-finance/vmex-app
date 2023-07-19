import { useQuery } from '@tanstack/react-query';
import { getAssetPrices, getAllAssetSymbols, convertAddressToSymbol } from '@vmexfinance/sdk';
import { SDK_PARAMS } from '../../utils/sdk-helpers';
import { IAssetPricesProps, IPricesDataProps } from './types';
import { IAvailableCoins } from '../../utils/helpers';

export async function getAllAssetPrices(): Promise<Record<IAvailableCoins, IAssetPricesProps>> {
    const pricesMap = await getAssetPrices({
        assets: getAllAssetSymbols(SDK_PARAMS.network),
        ...SDK_PARAMS,
    });
    const returnObj: Record<string, IAssetPricesProps> = {};
    pricesMap.forEach(({ oracle, priceETH, priceUSD }, key) => {
        let asset = convertAddressToSymbol(key, SDK_PARAMS.network);
        asset = asset.toUpperCase();
        (returnObj as any)[asset] = {
            oracle,
            ethPrice: priceETH,
            usdPrice: priceUSD, //bignumber
        };
    });

    return returnObj;
}

export function usePricesData(): IPricesDataProps {
    const queryAssetPrices = useQuery({
        queryKey: ['asset-prices'],
        queryFn: getAllAssetPrices,
        refetchInterval: 60000, // refetch prices every minute
    });

    return {
        prices: queryAssetPrices.data,
        isLoading: queryAssetPrices.isLoading,
        isError: queryAssetPrices.isError,
    };
}

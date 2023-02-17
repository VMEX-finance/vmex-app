import { useQuery } from '@tanstack/react-query';
import { getAssetPrices } from '@vmexfinance/sdk';
import {
    MAINNET_ASSET_MAPPINGS,
    REVERSE_MAINNET_ASSET_MAPPINGS,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { IAssetPricesProps, IPricesDataProps } from './types';
import { IAvailableCoins } from '../../utils/helpers';

export async function getAllAssetPrices(): Promise<Record<IAvailableCoins, IAssetPricesProps>> {
    const pricesMap = await getAssetPrices({
        assets: Array.from(MAINNET_ASSET_MAPPINGS.keys()),
        ...SDK_PARAMS,
    });

    const returnObj: Record<string, IAssetPricesProps> = {};
    pricesMap.forEach(({ oracle, priceETH, priceUSD }, key) => {
        const asset = REVERSE_MAINNET_ASSET_MAPPINGS.get(key.toLowerCase()) || key;
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

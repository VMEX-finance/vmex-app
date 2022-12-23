import { IAvailableCoins } from '../../utils/helpers';

export type IAssetPricesProps = {
    oracle: string;
    usdPrice: number;
};

export type IPricesDataProps = {
    prices: Record<IAvailableCoins, IAssetPricesProps> | undefined;
    isLoading: boolean;
    isError: boolean;
};

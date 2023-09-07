import { IAvailableCoins } from '@/utils';
import { BigNumber } from 'ethers';

export type IAssetPricesProps = {
    oracle: string;
    ethPrice: BigNumber;
    usdPrice: BigNumber;
};

export type IPricesDataProps = {
    prices: Record<IAvailableCoins, IAssetPricesProps> | undefined;
    isLoading: boolean;
    isError: boolean;
};

import { UseQueryResult } from '@tanstack/react-query';
import { IProtocolProps } from '@ui/features';
import { IMarketsAsset, ITrancheProps } from '../types';

type IAssetsPricesProps = {
    ethPrice?: string;
    usdPrice?: string;
};

export type IProtocolDataProps = {
    queryProtocolOverview: UseQueryResult<IProtocolProps, unknown>;
};

export type ITranchesDataProps = {
    queryAllTranches: UseQueryResult<ITrancheProps[], unknown>;
};

export type IMarketsDataProps = {
    queryAllMarkets: UseQueryResult<IMarketsAsset[], unknown>;
    getAssetsPrices: (_asset?: string) => any;
};

export type ITrancheMarketsDataProps = {
    queryTrancheMarkets: UseQueryResult<IMarketsAsset[], unknown>;
    getTrancheMarket: (asset: string) => IMarketsAsset;
};

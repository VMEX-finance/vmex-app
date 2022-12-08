import { UseQueryResult } from '@tanstack/react-query';
import { IProtocolProps } from '@ui/features';
import { IMarketsAsset, ITrancheProps } from '../models';

export type IProtocolDataProps = {
    queryProtocolOverview: UseQueryResult<IProtocolProps, unknown>;
};

export type ITranchesDataProps = {
    queryAllTranches: UseQueryResult<ITrancheProps[], unknown>;
};

export type IMarketsDataProps = {
    queryAllMarkets: UseQueryResult<IMarketsAsset[], unknown>;
};

export type ITrancheMarketsDataProps = {
    queryTrancheMarkets: UseQueryResult<IMarketsAsset[], unknown>;
    getTrancheMarket: (asset: string) => IMarketsAsset;
};

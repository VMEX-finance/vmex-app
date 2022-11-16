import { IMarketsAsset } from '@models/markets';
import { useQuery } from '@tanstack/react-query';
import { MOCK_MARKETS_DATA } from '../../utils/mock-data';
import { IMarketsDataProps } from './types';

export function getAllMarkets(): IMarketsAsset[] {
    return MOCK_MARKETS_DATA;
}

export function useMarketsData(): IMarketsDataProps {
    const queryAllMarkets = useQuery({
        queryKey: ['all-tranches'],
        queryFn: getAllMarkets,
    });

    return {
        queryAllMarkets,
    };
}

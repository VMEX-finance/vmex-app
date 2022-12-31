import { useQueries } from '@tanstack/react-query';
import {
    getSubgraphProtocolChart,
    getSubgraphProtocolData,
    getSubgraphUserChart,
} from '../subgraph';
import { getUserActivityData } from '../user';

export const useOverviewPageQuery = (_address?: `0x${string}`) => {
    const result = useQueries({
        queries: [
            {
                queryKey: ['subgraph-protocol-charts'],
                queryFn: () => getSubgraphProtocolChart(),
                refetchInterval: 1 * 60 * 100,
            },
            {
                queryKey: ['subgraph-protocol-data'],
                queryFn: () => getSubgraphProtocolData(),
            },
            {
                queryKey: ['subgraph-user-pnl-chart'],
                queryFn: () => getSubgraphUserChart(_address || ''),
                refetchInterval: 1 * 60 * 1000, // Refetch every minute,
                enabled: !!_address, // only query when address is passed
            },
            {
                queryKey: ['user-activity'],
                queryFn: () => getUserActivityData(_address || ''),
                enabled: !!_address, // only query when address is passed
            },
        ],
    });

    return {
        queryProtocolTVLChart: result[0],
        queryProtocolData: result[1],
        queryUserPnlChart: result[2],
        queryUserActivity: result[3],
    };
};

export const useTranchesPageQuery = () => {};

export const useTrancheDetailsPageQuery = () => {};

export const useMarketsPageQuery = () => {};

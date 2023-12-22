import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { getNetworkName } from '../utils/network';
import {
    IGaugesAsset,
    IMarketsAsset,
    IVaultAsset,
    useGauages,
    useSubgraphAllMarketsData,
    useSubgraphTranchesOverviewData,
} from '@/api';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { TESTING } from '@/utils';

// Types
export type IVaultsStoreProps = {
    vaults: IVaultAsset[];
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
    refresh?: () => void;
};

// Context
const VaultsContext = createContext<IVaultsStoreProps>({
    vaults: [],
    isLoading: false,
    isError: false,
    error: '',
    refresh: () => {},
});

const calculateApyFromRewardRate = (val: string | number): number => {
    if (!val) return 0;
    const _val = Number(val);
    return _val * 86400 * 365;
};

// Utils
const renderGauges = async (gauges: IGaugesAsset[]): Promise<IVaultAsset[]> => {
    if (!gauges.length) return [];
    return await Promise.all(
        gauges.map((g, i) => ({
            gaugeAddress: g.address,
            vaultAddress: g.vaultAddress,
            decimals: g.decimals,
            vaultName: g.name,
            vaultApy: 0,
            vaultDeposited: g.totalStaked,
            gaugeAPR: calculateApyFromRewardRate(g.rewardRate.normalized),
            gaugeBoost: 0,
            gaugeStaked: g.totalStaked,
            vaultSymbol: g.symbol,
            actions: undefined,
        })),
    );
};

export function getUnderlying(_vaultSymbol?: string, markets?: IMarketsAsset[]) {
    if (!_vaultSymbol || !markets?.length) return;
    const trimmed = _vaultSymbol?.substring(4);
    const trancheId = _vaultSymbol.slice(_vaultSymbol.length - 1);
    const symbol = trimmed.slice(0, trimmed.length - 1);
    const market = markets?.find(
        (el) =>
            String(el?.trancheId || 0) === String(trancheId) &&
            String(el.asset)?.toLowerCase() === String(symbol)?.toLowerCase(),
    );
    return market;
}

// Wrapper
export function VaultsStore(props: { children: ReactNode }) {
    const network = getNetworkName();
    const { queryGauges } = useGauages();
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    const queryVaults = useQuery({
        queryKey: ['vaults', network],
        queryFn: () => renderGauges(queryGauges.data),
        enabled: queryGauges?.data?.length > 0,
        initialData: [],
        refetchInterval: 10 * 1000,
    });

    const refresh = () => {
        // TODO: force refresh
    };

    const vaults = useMemo(() => {
        if (queryAllMarketsData.data?.length) {
            const markets = queryAllMarketsData.data;
            return queryVaults?.data?.map((v) => {
                const underlying = getUnderlying(v.vaultSymbol, markets);
                return {
                    ...v,
                    vaultApy: Number(underlying?.supplyApy || '0'),
                };
            });
        } else {
            return queryVaults.data;
        }
    }, [queryAllMarketsData.isLoading, queryGauges.isLoading]);

    return (
        <VaultsContext.Provider
            value={{
                vaults,
                isLoading: queryVaults.isLoading,
                isError: queryVaults.isError,
                error: queryVaults.error,
                refresh,
            }}
        >
            {props.children}
        </VaultsContext.Provider>
    );
}

// Independent
export function useVaultsContext() {
    return useContext(VaultsContext);
}

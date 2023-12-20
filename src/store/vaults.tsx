import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { getNetworkName } from '../utils/network';
import { IGaugesAsset, IVaultAsset, useGauages } from '@/api';
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

// Utils
const renderGauges = async (gauges: IGaugesAsset[]): Promise<IVaultAsset[]> => {
    if (!gauges.length) return [];
    return await Promise.all(
        gauges.map((g) => ({
            gaugeAddress: g.address,
            vaultAddress: g.vaultAddress,
            decimals: g.decimals,
            vaultIcon: '/3D-logo.svg',
            vaultName: g.name,
            vaultApy: Number(g.rewardRate.normalized),
            vaultDeposited: g.totalStaked,
            gaugeAPR: Number(g.rewardRate.normalized),
            gaugeBoost: 0,
            gaugeStaked: g.totalStaked,
            vaultSymbol: g.symbol,
            actions: undefined,
        })),
    );
};

// Wrapper
export function VaultsStore(props: { children: ReactNode }) {
    const network = getNetworkName();
    const { queryGauges } = useGauages();

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

    // TODO: remove
    useEffect(() => {
        if (TESTING) {
            console.log('Available Vaults:', queryVaults.data);
        }
    }, [queryVaults.data]);

    return (
        <VaultsContext.Provider
            value={{
                vaults: queryVaults.data,
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

import { TESTING, getNetworkName } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useGauages } from './gauges';
import { IGaugesAsset, IVaultAsset } from './types';
import { useEffect } from 'react';

const renderGauges = async (gauges: IGaugesAsset[]): Promise<IVaultAsset[]> => {
    if (!gauges.length) return [];
    return await Promise.all(
        gauges.map((g) => ({
            gaugeAddress: g.address,
            vaultAddress: g.vaultAddress,
            decimals: g.decimals,
            vaultIcon: '/coins/algo.svg',
            vaultName: g.name,
            vaultApy: Number(g.rewardRate.normalized),
            vaultDeposited: g.totalStaked,
            gaugeAPR: Number(g.rewardRate.normalized),
            gaugeBoost: 0,
            gaugeStaked: g.totalStaked,
            actions: undefined,
        })),
    );
};

export const useVaults = () => {
    const network = getNetworkName();
    const { queryGauges } = useGauages();

    const queryVaults = useQuery({
        queryKey: ['vaults', network],
        queryFn: () => renderGauges(queryGauges.data),
        enabled: queryGauges?.data?.length > 0,
        initialData: [],
    });

    // TODO: remove
    useEffect(() => {
        if (TESTING) {
            console.log('Available Vaults:', queryVaults.data);
        }
    }, [queryVaults.data]);

    return {
        queryVaults,
    };
};

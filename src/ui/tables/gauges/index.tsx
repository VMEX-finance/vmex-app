import React from 'react';
import { CacheProvider } from '@emotion/react';
import { muiCache, options } from '../utils';
import { GaugesCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { Loader } from '@/ui/components';
import { UseQueryResult } from '@tanstack/react-query';
import { IUserActivityDataProps, IGaugesAsset, useGauages, IVaultAsset } from '@/api';
import { useAccount } from 'wagmi';

interface ITableProps {
    data?: IVaultAsset[];
    loading?: boolean;
    userData?: UseQueryResult<IUserActivityDataProps, unknown>;
    error?: boolean;
}

export const GaugesTable: React.FC<ITableProps> = ({ data, loading, userData, error }) => {
    const { address } = useAccount();

    const columns = [
        {
            name: 'vaultName',
            label: 'Vault',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
                filterOptions: {
                    names: ['Yearn', 'Curve', 'Beethoven', 'Velo', 'Base'],
                    logic: (location: any, filters: any, row: any) => {
                        if (filters.length) {
                            switch (filters[0]?.toLowerCase()) {
                                case 'yearn':
                                    return !location.startsWith('yv');
                                case 'curve':
                                    return !location?.toLowerCase().includes('crv');
                                case 'beethoven':
                                    return !location.startsWith('BPT');
                                case 'velo':
                                    return !location?.toLowerCase().includes('ammv2');
                                case 'base':
                                    return (
                                        location?.toLowerCase().includes('ammv2') ||
                                        location.startsWith('yv') ||
                                        location?.toLowerCase().includes('crv') ||
                                        location.startsWith('BPT')
                                    );
                            }
                        }
                        return false;
                    },
                },
            },
        },
        {
            name: 'vaultApy',
            label: 'Vault APY',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'vaultDeposited',
            label: 'Deposited in Vault',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'gaugeAPR',
            label: 'Gauge APR',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'gaugeStaked',
            label: 'Staked In Gauge',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'gaugeBoost',
            label: 'Boost',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'decimals',
            label: 'Decimals',
            options: {
                display: false,
            },
        },
        {
            name: 'vaultAddress',
            label: 'Vault Address',
            options: {
                display: false,
            },
        },
        {
            name: 'vaultIcon',
            label: 'Icon',
            options: {
                display: false,
            },
        },
        {
            name: 'gaugeAddress',
            label: 'Gauge Address',
            options: {
                display: false,
            },
        },
        {
            name: '',
            label: '',
            options: {
                filter: false,
            },
        },
    ];

    return (
        <CacheProvider value={muiCache('markets')}>
            <MUIDataTable
                title={'All Available Assets'}
                columns={columns as any}
                data={data || []}
                options={{
                    ...options,
                    customRowRender: (
                        [
                            vaultName,
                            vaultApy,
                            vaultDeposited,
                            gaugeAPR,
                            gaugeStaked,
                            gaugeBoost,
                            decimals,
                            vaultAddress,
                            vaultIcon,
                            gaugeAddress,
                            actions,
                        ],
                        dataIndex,
                        rowIndex,
                    ) => (
                        <GaugesCustomRow
                            gaugeAddress={gaugeAddress}
                            vaultAddress={vaultAddress}
                            decimals={decimals}
                            vaultIcon={vaultIcon}
                            vaultName={vaultName}
                            vaultApy={vaultApy}
                            vaultDeposited={vaultDeposited}
                            gaugeAPR={gaugeAPR}
                            gaugeBoost={gaugeBoost}
                            gaugeStaked={gaugeStaked}
                            actions={actions}
                            key={`gauges-table-${rowIndex || Math.floor(Math.random() * 10000)}`}
                        />
                    ),
                    textLabels: {
                        body: {
                            noMatch:
                                loading && !data?.length ? (
                                    <Loader type="spinner" />
                                ) : error ? (
                                    <span className="flex justify-center items-center min-h-[100px]">
                                        An error has occured while fetching gauges. Please refresh
                                        the page.
                                    </span>
                                ) : (
                                    <span className="flex justify-center items-center min-h-[100px]">
                                        No gauges available. Please check again later.
                                    </span>
                                ),
                        },
                    },
                }}
            />
        </CacheProvider>
    );
};

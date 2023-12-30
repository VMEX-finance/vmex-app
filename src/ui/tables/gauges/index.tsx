import React from 'react';
import { CacheProvider } from '@emotion/react';
import { muiCache, options } from '../utils';
import { GaugesCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { Loader } from '@/ui/components';
import { UseQueryResult } from '@tanstack/react-query';
import { IUserActivityDataProps, IVaultAsset } from '@/api';

interface ITableProps {
    data?: IVaultAsset[];
    loading?: boolean;
    userData?: UseQueryResult<IUserActivityDataProps, unknown>;
    error?: boolean;
}

const GaugesTable: React.FC<ITableProps> = React.memo(({ data, loading, userData, error }: any) => {
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
            label: 'Asset APY',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'vaultDeposited',
            label: 'Deposited in Tranche',
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
                // filter: true,
                // sort: true,
                // sortThirdClickReset: true,
                display: false,
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
            name: 'vaultSymbol',
            label: 'Symbol',
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
            name: 'underlyingAddress',
            label: 'Underlying Address',
            options: {
                display: false,
            },
        },
        {
            name: 'underlyingSymbol',
            label: 'Underlying Symbol',
            options: {
                display: false,
            },
        },
        {
            name: 'underlyingDecimals',
            label: 'Underlying Decimals',
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
                    sortOrder: {
                        name: 'gaugeAPR',
                        direction: 'desc',
                    },
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
                            vaultSymbol,
                            gaugeAddress,
                            underlyingAddress,
                            underlyingSymbol,
                            underlyingDecimals,
                            actions,
                        ],
                        dataIndex,
                        rowIndex,
                    ) => (
                        <GaugesCustomRow
                            gaugeAddress={gaugeAddress}
                            vaultAddress={vaultAddress}
                            decimals={decimals}
                            vaultName={vaultName}
                            vaultApy={vaultApy}
                            vaultDeposited={vaultDeposited}
                            gaugeAPR={gaugeAPR}
                            gaugeBoost={gaugeBoost}
                            gaugeStaked={gaugeStaked}
                            vaultSymbol={vaultSymbol}
                            actions={actions}
                            underlyingAddress={underlyingAddress}
                            underlyingSymbol={underlyingSymbol}
                            underlyingDecimals={underlyingDecimals}
                            key={`gauges-table-${rowIndex || Math.floor(Math.random() * 10000)}`}
                            loading={loading}
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
});

GaugesTable.displayName = 'GaugesTable';

export { GaugesTable };

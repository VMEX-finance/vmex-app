import React from 'react';
import { CacheProvider } from '@emotion/react';
import { muiCache, options } from '../utils';
import { GaugesCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { Loader } from '@/ui/components';
import { UseQueryResult } from '@tanstack/react-query';
import { IUserActivityDataProps, IGaugesAsset, useGauages } from '@/api';
import { useAccount } from 'wagmi';

interface ITableProps {
    data?: IGaugesAsset[];
    loading?: boolean;
    userActivity?: UseQueryResult<IUserActivityDataProps, unknown>;
    error?: boolean;
}

export const GaugesTable: React.FC<ITableProps> = ({ data, loading, userActivity, error }) => {
    const { address } = useAccount();

    const columns = [
        {
            name: 'asset',
            label: 'Asset',
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
                sortOrder: 'desc',
            },
        },
        {
            name: 'depositedInVault',
            label: 'Deposited In Vault',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
                display: address ? true : false,
            },
        },
        {
            name: 'gaugeApr',
            label: 'Guage APR',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'stakedInGauge',
            label: 'Staked in Gauge',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'boost',
            label: 'Boost',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'trancheId',
            label: 'Tranche ID',
            options: {
                filter: false,
                sort: false,
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
                            asset,
                            tranche,
                            supplyApy,
                            borrowApy,
                            walletBalance,
                            available,
                            supplyTotal,
                            borrowTotal,
                            // rating,
                            strategies,
                            canBeCollateral,
                            trancheId,
                            canBeBorrowed,
                            featured,
                        ],
                        dataIndex,
                        rowIndex,
                    ) => (
                        <GaugesCustomRow
                            asset={asset}
                            tranche={tranche}
                            trancheId={trancheId}
                            supplyApy={supplyApy}
                            borrowApy={borrowApy}
                            // yourAmount={renderYourAmount(asset, trancheId)}
                            walletBalance={walletBalance}
                            available={available}
                            borrowTotal={borrowTotal}
                            supplyTotal={supplyTotal}
                            // rating={rating}
                            strategies={strategies}
                            collateral={canBeCollateral}
                            key={`markets-table-${rowIndex || Math.floor(Math.random() * 10000)}`}
                            borrowable={canBeBorrowed}
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

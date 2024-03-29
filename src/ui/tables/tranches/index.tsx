import React from 'react';
import { CacheProvider } from '@emotion/react';
import { muiCache, options } from '../utils';
import { TranchesCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { Loader } from '@/ui/components';
import { addFeaturedTranches, usdFormatter } from '@/utils';
import { UseQueryResult } from '@tanstack/react-query';
import { IUserActivityDataProps, ITrancheProps } from '@/api';
import { useAccount } from 'wagmi';

interface IDataTable {
    data?: ITrancheProps[];
    loading?: boolean;
    userActivity?: UseQueryResult<IUserActivityDataProps, unknown>;
}

const TranchesTable: React.FC<IDataTable> = React.memo(
    ({ data, loading, userActivity }: IDataTable) => {
        const { address } = useAccount();
        const renderActivity = (trancheId: string) => {
            let activity: string = '';
            if (!trancheId || userActivity?.isLoading) activity = 'loading';
            userActivity?.data?.borrows.length !== 0 &&
                userActivity?.data?.borrows.map((borrow) => {
                    if (borrow.trancheId === Number(trancheId)) {
                        activity = 'borrowed';
                    }
                });
            userActivity?.data?.supplies.length !== 0 &&
                userActivity?.data?.supplies.map((supply) => {
                    if (supply.trancheId === Number(trancheId) && activity === '')
                        activity = 'supplied';
                    else if (supply.trancheId === Number(trancheId) && activity === 'borrowed')
                        activity = 'both';
                });
            return activity;
        };

        const columns = [
            {
                name: 'id',
                label: 'ID',
                options: {
                    filter: false,
                    sort: true,
                    sortThirdClickReset: true,
                    sortCompare: (order: 'asc' | 'desc' | 'none') => {
                        return (obj1: any, obj2: any) => {
                            const val1 = parseInt(obj1.data, 10);
                            const val2 = parseInt(obj2.data, 10);
                            return (val1 - val2) * (order === 'asc' ? 1 : -1);
                        };
                    },
                },
            },
            {
                name: 'name',
                label: 'Tranche',
                options: {
                    filter: false,
                    sort: true,
                    sortThirdClickReset: true,
                },
            },
            {
                name: 'assets',
                label: 'Assets',
                options: {
                    filter: true,
                    sort: false,
                    sortThirdClickReset: true,
                },
            },
            {
                name: 'category',
                label: 'Category',
                options: {
                    filter: true,
                    sort: true,
                    sortThirdClickReset: true,
                },
            },
            // {
            //     name: 'aggregateRating',
            //     label: 'Rating',
            //     options: {
            //         filter: true,
            //         sort: true,
            //         sortThirdClickReset: true,
            //     },
            // },
            {
                name: 'yourActivity',
                label: 'Your Activity',
                options: {
                    filter: true,
                    sort: true,
                    sortThirdClickReset: true,
                    display: address ? true : false,
                },
            },
            {
                name: 'supplyTotal',
                label: 'Supplied',
                options: {
                    filter: false,
                    sort: true,
                    sortThirdClickReset: true,
                },
            },
            {
                name: 'borrowTotal',
                label: 'Borrowed',
                options: {
                    filter: false,
                    sort: true,
                    sortThirdClickReset: true,
                },
            },
            {
                name: 'featured',
                label: 'Featured',
                options: {
                    filter: true,
                    sort: true,
                    sortThirdClickReset: true,
                    display: false,
                    filterType: 'dropdown',
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
            <CacheProvider value={muiCache('tranches')}>
                <MUIDataTable
                    title={'All Available Tranches'}
                    columns={columns as any}
                    data={addFeaturedTranches(data, 'tranches')}
                    options={{
                        ...options,
                        customRowRender: (
                            [
                                id,
                                name,
                                assets,
                                category,
                                // aggregateRating,
                                yourActivity,
                                supplyTotal,
                                borrowTotal,
                            ],
                            dataIndex,
                            rowIndex,
                        ) => (
                            <TranchesCustomRow
                                name={name}
                                assets={assets}
                                // aggregateRating={aggregateRating}
                                yourActivity={renderActivity(id)}
                                supplyTotal={usdFormatter().format(supplyTotal)}
                                borrowTotal={usdFormatter().format(borrowTotal)}
                                category={category}
                                id={id}
                                key={`tranches-table-${
                                    rowIndex || Math.floor(Math.random() * 10000)
                                }`}
                            />
                        ),
                        textLabels: {
                            body: {
                                noMatch: loading ? (
                                    <Loader type="spinner" />
                                ) : (
                                    'An error has occured while fetching tranches. Please refresh the page.'
                                ),
                            },
                        },
                    }}
                />
            </CacheProvider>
        );
    },
);

TranchesTable.displayName = 'TranchesTable';

export { TranchesTable };

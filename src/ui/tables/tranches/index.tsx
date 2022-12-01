import React from 'react';
import type { ITrancheProps } from '../../../models/tranches';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { muiCache, options, vmexTheme } from '../utils';
import { TranchesCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { SpinnerLoader } from '../../components/loaders';

interface IDataTable {
    data?: ITrancheProps[];
    loading?: boolean;
}

export const TranchesTable: React.FC<IDataTable> = ({ data, loading }) => {
    const columns = [
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
            name: 'aggregateRating',
            label: 'Aggregate Rating',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'yourActivity',
            label: 'Your Activity',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
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
            name: 'id',
            label: 'ID',
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
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={vmexTheme()}>
                <MUIDataTable
                    title={['All Available Tranches']}
                    columns={columns}
                    data={data || []}
                    options={{
                        ...options,
                        customRowRender: (data: any) => {
                            const [
                                name,
                                assets,
                                aggregateRating,
                                yourActivity,
                                supplyTotal,
                                borrowTotal,
                                id,
                            ] = data;
                            console.log('DATA: ');
                            console.log(data);
                            return (
                                <TranchesCustomRow
                                    name={name}
                                    assets={assets}
                                    aggregateRating={aggregateRating}
                                    yourActivity={yourActivity}
                                    supplyTotal={supplyTotal}
                                    borrowTotal={borrowTotal}
                                    id={id}
                                />
                            );
                        },
                        textLabels: {
                            body: {
                                noMatch: loading ? (
                                    <SpinnerLoader />
                                ) : (
                                    'An error has occured while fetching tranches. Please refresh the page.'
                                ),
                            },
                        },
                    }}
                />
            </ThemeProvider>
        </CacheProvider>
    );
};

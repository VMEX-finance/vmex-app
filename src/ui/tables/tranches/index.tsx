import React, { useContext } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { muiCache, options, vmexTheme } from '../utils';
import { TranchesCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { SpinnerLoader } from '../../components/loaders';
import { ITrancheProps } from '../../../api/types';
import { ThemeContext } from '../../../store/contexts';
import { usdFormatter } from '../../../utils/helpers';
import { UseQueryResult } from '@tanstack/react-query';
import { IUserActivityDataProps } from '@app/api/user/types';

interface IDataTable {
    data?: ITrancheProps[];
    loading?: boolean;
    userActivity?: UseQueryResult<IUserActivityDataProps, unknown>;
}

export const TranchesTable: React.FC<IDataTable> = ({ data, loading, userActivity }) => {
    const { isDark } = useContext(ThemeContext);

    const renderActivity = (trancheId: string) => {
        let activity = '';
        if (userActivity?.isLoading) activity = 'loading';
        userActivity?.data?.borrows.map((borrow) => {
            if (borrow.trancheId === Number(trancheId)) activity = 'borrowed';
        });
        userActivity?.data?.supplies.map((supply) => {
            if (supply.trancheId === Number(trancheId) && activity === '') activity = 'supplied';
            else if (supply.trancheId === Number(trancheId) && activity !== '') activity = 'both';
        });
        return activity;
    };

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
            <ThemeProvider theme={vmexTheme(isDark)}>
                <MUIDataTable
                    title={'All Available Tranches'}
                    columns={columns}
                    data={data || []}
                    options={{
                        ...options,
                        customRowRender: (
                            [
                                name,
                                assets,
                                aggregateRating,
                                yourActivity,
                                supplyTotal,
                                borrowTotal,
                                id,
                            ],
                            dataIndex,
                            rowIndex,
                        ) => (
                            <TranchesCustomRow
                                name={name}
                                assets={assets}
                                aggregateRating={aggregateRating}
                                yourActivity={renderActivity(id)}
                                supplyTotal={usdFormatter().format(supplyTotal)}
                                borrowTotal={usdFormatter().format(borrowTotal)}
                                id={id}
                                key={`tranches-table-${
                                    rowIndex || Math.floor(Math.random() * 10000)
                                }`}
                            />
                        ),
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

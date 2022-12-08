import React from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { muiCache, options, vmexTheme } from '../utils';
import { MarketsCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { SpinnerLoader } from '../../components/loaders';
import { IMarketsAsset } from '@app/api/models';

interface ITableProps {
    data?: IMarketsAsset[];
    loading?: boolean;
}

export const MarketsTable: React.FC<ITableProps> = ({ data, loading }) => {
    const columns = [
        {
            name: 'asset',
            label: 'Asset',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'tranche',
            label: 'Tranche',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'supplyApy',
            label: 'Supply APY',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'borrowApy',
            label: 'Borrow APY',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'yourAmount',
            label: 'Your Amount',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'available',
            label: 'Available',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'supplyTotal',
            label: 'Supply Total',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'borrowTotal',
            label: 'Borrow Total',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'rating',
            label: 'Rating',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'strategies',
            label: 'Strategies',
            options: {
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'logo',
            label: 'Logo',
            options: {
                filter: false,
                sort: false,
                display: false,
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
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={vmexTheme()}>
                <MUIDataTable
                    title={['All Available Assets']}
                    columns={columns}
                    data={data || []}
                    options={{
                        ...options,
                        customRowRender: (data: any) => {
                            const [
                                asset,
                                tranche,
                                supplyApy,
                                borrowApy,
                                yourAmount,
                                available,
                                supplyTotal,
                                borrowTotal,
                                rating,
                                strategies,
                                logo,
                                trancheId,
                            ] = data;

                            return (
                                <MarketsCustomRow
                                    asset={asset}
                                    tranche={tranche}
                                    trancheId={trancheId}
                                    supplyApy={supplyApy}
                                    borrowApy={borrowApy}
                                    yourAmount={yourAmount}
                                    available={available}
                                    borrowTotal={borrowTotal}
                                    supplyTotal={supplyTotal}
                                    rating={rating}
                                    strategies={strategies}
                                    logo={logo}
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

import React from 'react';
import type { ITrancheProps } from '../../../models/tranches';
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';
import { determineRatingColor } from '../../../utils/helpers';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { MultipleAssetsDisplay } from '../displays';
import { useWindowSize } from '../../../hooks/ui';
import { IconTooltip } from '../tooltips/Icon';
import { TableTemplate } from '../../templates';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { options } from './tranches-table-config';
interface IDataTable {
    data: ITrancheProps[];
}

export const TranchesTableDos: React.FC<IDataTable> = ({ data }) => {
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();
    const { width } = useWindowSize();

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
                filter: true,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'borrowTotal',
            label: 'Borrowed',
            options: {
                filter: true,
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
    ];

    const muiCache = createCache({
        key: 'mui-datatables',
        prepend: true,
    });

    // const { transactions, loading } = useTransactionContext();
    function vmexTheme() {
        return createTheme({
            palette: {
                primary: {
                    main: '#7667db',
                },
            },
            components: {},
        });
    }
    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={vmexTheme()}>
                <TableTemplate
                    title={['All Available Tranches']}
                    columns={columns}
                    data={data}
                    options={options}
                />
            </ThemeProvider>
        </CacheProvider>
    );
};

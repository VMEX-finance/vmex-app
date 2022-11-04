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
import { options } from './markets-table-config';
import type { MarketsAsset } from '../../../models/markets';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

interface IAvailableLiquidityTable {
    data: MarketsAsset[];
}

export const MarketsTable: React.FC<IAvailableLiquidityTable> = ({ data }) => {
    const columns = [
        {
            name: 'asset',
            label: 'Asset',
            options: {
                filter: false,
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
            label: 'Supply APY%',
            options: {
                filter: false,
                sort: true,
                sortThirdClickReset: true,
            },
        },
        {
            name: 'borrowApy',
            label: 'Borrow APY%',
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
    ];

    const muiCache = createCache({
        key: 'mui-datatables',
        prepend: true,
    });

    // const { transactions, loading } = useTransactionContext();

    return (
        <CacheProvider value={muiCache}>
            <TableTemplate
                title={['All Available Assets']}
                columns={columns}
                data={data}
                options={options}
            />
        </CacheProvider>
    );
};

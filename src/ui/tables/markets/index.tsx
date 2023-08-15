import React, { useContext } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { muiCache, options, vmexTheme } from '../utils';
import { MarketsCustomRow } from './custom-row';
import MUIDataTable from 'mui-datatables';
import { SpinnerLoader } from '../../components/loaders';
import { IMarketsAsset } from '@app/api/types';
import { ThemeContext } from '../../../store';
import {
    addFeaturedTranches,
    bigNumberToUnformattedString,
    numberFormatter,
    percentFormatter,
} from '../../../utils';
import { UseQueryResult } from '@tanstack/react-query';
import { IUserActivityDataProps } from '@app/api/user/types';

interface ITableProps {
    data?: IMarketsAsset[];
    loading?: boolean;
    userActivity?: UseQueryResult<IUserActivityDataProps, unknown>;
}

export const MarketsTable: React.FC<ITableProps> = ({ data, loading, userActivity }) => {
    const { isDark } = useContext(ThemeContext);

    const renderYourAmount = (asset: string) => {
        let amount = 0;
        if (userActivity?.isLoading)
            return {
                amount,
                loading: true,
            };
        userActivity?.data?.supplies.map((supply) => {
            if (supply.asset === asset)
                amount =
                    amount +
                    parseFloat(bigNumberToUnformattedString(supply.amountNative, supply.asset));
        });
        userActivity?.data?.borrows.map((borrow) => {
            if (borrow.asset === asset)
                amount =
                    amount -
                    parseFloat(bigNumberToUnformattedString(borrow.amountNative, borrow.asset));
        });
        return {
            amount: numberFormatter.format(amount),
            loading: false,
        };
    };

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
            label: 'Available Borrows',
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
            name: 'canBeCollateral',
            label: 'Collateral',
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
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={vmexTheme(isDark)}>
                <MUIDataTable
                    title={'All Available Assets'}
                    columns={columns as any}
                    data={addFeaturedTranches(data, 'markets')}
                    options={{
                        ...options,
                        customRowRender: (
                            [
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
                                canBeCollateral,
                                trancheId,
                            ],
                            dataIndex,
                            rowIndex,
                        ) => {
                            return (
                                <MarketsCustomRow
                                    asset={asset}
                                    tranche={tranche}
                                    trancheId={trancheId}
                                    supplyApy={percentFormatter.format(supplyApy)}
                                    borrowApy={percentFormatter.format(borrowApy)}
                                    yourAmount={renderYourAmount(asset)}
                                    available={available}
                                    borrowTotal={borrowTotal}
                                    supplyTotal={supplyTotal}
                                    rating={rating}
                                    strategies={asset.toLowerCase().startsWith('yv')}
                                    collateral={canBeCollateral}
                                    key={`markets-table-${
                                        rowIndex || Math.floor(Math.random() * 10000)
                                    }`}
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

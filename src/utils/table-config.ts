import { MUIDataTableColumn, MUIDataTableOptions } from 'mui-datatables';

import { CustomRow } from '../ui/components/tables/custom-row';

export const options: MUIDataTableOptions = {
    download: false,
    print: false,
    viewColumns: false,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    searchPlaceholder: 'Search...',
    customRowRender: CustomRow,
    searchOpen: true,
};

export const columns: Array<MUIDataTableColumn> = [
    {
        name: 'timestamp',
        label: 'Date',
        options: {
            filter: true,
            sort: true,
            sortThirdClickReset: true,
            customBodyRender: (value) => new Date(value).toLocaleDateString(),
        },
    },
    {
        name: 'zeroHash',
        label: 'Hash',
        options: {
            filter: false,
            sort: false,
            sortThirdClickReset: true,
        },
    },
    {
        name: 'fromChain',
        label: 'From',
        options: {
            filter: true,
            sort: false,
            sortThirdClickReset: true,
        },
    },
    {
        name: 'toChain',
        label: 'To',
        options: {
            filter: true,
            sort: false,
            sortThirdClickReset: true,
        },
    },
    {
        name: 'type',
        label: 'Type',
        options: {
            filter: true,
            sort: false,
            sortThirdClickReset: true,
        },
    },
    {
        name: 'amount',
        label: 'Amount',
        options: {
            filter: false,
            sort: false,
            sortThirdClickReset: true,
        },
    },
];

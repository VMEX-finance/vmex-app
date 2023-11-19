import createCache from '@emotion/cache';
import { MUIDataTableOptions } from 'mui-datatables';

export const muiCache = (addToKey: string) =>
    createCache({
        key: `mui-datatables-${addToKey}`,
        prepend: true,
    });

export const options: MUIDataTableOptions = {
    download: false,
    print: false,
    viewColumns: false,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    searchPlaceholder: 'Search...',
    searchAlwaysOpen: true,
};

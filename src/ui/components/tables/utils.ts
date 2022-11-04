import createCache from '@emotion/cache';
import { createTheme } from '@mui/material/styles';
import { MUIDataTableOptions } from 'mui-datatables';

export const muiCache = createCache({
    key: 'mui-datatables',
    prepend: true,
});

export function vmexTheme() {
    return createTheme({
        palette: {
            primary: {
                main: '#7667db',
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '0.5rem',
                    },
                },
            },
        },
    });
}

export const options: MUIDataTableOptions = {
    download: false,
    print: false,
    viewColumns: false,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    searchPlaceholder: 'Search...',
    searchOpen: true,
};

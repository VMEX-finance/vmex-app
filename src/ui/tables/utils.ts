import createCache from '@emotion/cache';
import { createTheme } from '@mui/material/styles';
import { MUIDataTableOptions } from 'mui-datatables';

export const muiCache = createCache({
    key: 'mui-datatables',
    prepend: true,
});

export function vmexTheme(isDark = false) {
    return (createTheme as any)({
        palette: {
            mode: isDark ? 'dark' : 'light',
            background: {
                paper: isDark ? '#0f0f0f' : '#fff',
            },
            primary: {
                main: isDark ? '#fff' : '#0f0f0f',
            },
        },
        components: {
            MUIDataTableToolbar: {
                styleOverrides: {
                    root: {
                        display: 'flex',
                        alignItems: 'center',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '0.375rem',
                        backgroundImage: 'none',
                        boxShadow:
                            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
            MUIDataTablePagination: {
                styleOverrides: {
                    tableCellContainer: {
                        border: '0',
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
    searchAlwaysOpen: true,
};

import createCache from '@emotion/cache';
import { createTheme } from '@mui/material/styles';
import { ThemeContext } from '../../store/contexts';
import { MUIDataTableOptions } from 'mui-datatables';
import { useContext } from 'react';

export const muiCache = createCache({
    key: 'mui-datatables',
    prepend: true,
});

export function vmexTheme(isDark = false) {
    return createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            background: {
                paper: isDark ? '#000' : '#fff',
            },
            primary: {
                main: isDark ? '#fff' : '#000',
            },
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '0.5rem',
                        backgroundImage: 'none',
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

import { useWindowSize } from '@/hooks';
import { createTheme } from '@mui/material/styles';

export function vmexTheme(isDark = false) {
    return (createTheme as any)({
        palette: {
            mode: isDark ? 'dark' : 'light',
            background: {
                paper: isDark ? '#191919' : '#fff',
            },
            primary: {
                main: isDark ? '#fff' : '#191919',
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
            MUIDataTableSearch: {
                styleOverrides: {
                    clearIcon: {
                        display: 'hidden',
                        padding: '0',
                        width: '0',
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        padding: '2px 8px',
                    },
                    main: {
                        padding: '2px 8px',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: '0.375rem',
                        backgroundImage: 'none',
                        boxShadow: 'none',
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        paddingBottom: '4px !important',
                        paddingTop: '8px !important',
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

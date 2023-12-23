import { createTheme } from '@mui/material/styles';

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
            MuiTab: {
                styleOverrides: {
                    root: {
                        padding: '6px 10px',
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

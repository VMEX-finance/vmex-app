const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
    addWebpackAlias({
        ['@/api']: path.resolve(__dirname, 'src/api'),
        ['@/api/*']: path.resolve(__dirname, 'src/api/*'),
        ['@/pages']: path.resolve(__dirname, 'src/pages'),
        ['@/pages/*']: path.resolve(__dirname, 'src/pages/*'),
        ['@/store']: path.resolve(__dirname, 'src/store'),
        ['@/store/*']: path.resolve(__dirname, 'src/store/*'),
        ['@/utils']: path.resolve(__dirname, 'src/utils'),
        ['@/utils/*']: path.resolve(__dirname, 'src/utils/*'),
        ['@/ui/base']: path.resolve(__dirname, 'src/ui/base'),
        ['@/ui/base/*']: path.resolve(__dirname, 'src/ui/base/*'),
        ['@/ui/components']: path.resolve(__dirname, 'src/ui/components'),
        ['@/ui/components/*']: path.resolve(__dirname, 'src/ui/components/*'),
        ['@/ui/features']: path.resolve(__dirname, 'src/ui/features'),
        ['@/ui/features/*']: path.resolve(__dirname, 'src/ui/features/*'),
        ['@/ui/tables']: path.resolve(__dirname, 'src/ui/tables'),
        ['@/ui/tables/*']: path.resolve(__dirname, 'src/ui/tables/*'),
        ['@/ui/modals']: path.resolve(__dirname, 'src/ui/modals'),
        ['@/ui/modals/*']: path.resolve(__dirname, 'src/ui/modals/*'),
        ['@/ui/templates']: path.resolve(__dirname, 'src/ui/templates'),
        ['@/ui/templates/*']: path.resolve(__dirname, 'src/ui/templates/*'),
        ['@/ui/charts']: path.resolve(__dirname, 'src/ui/charts'),
        ['@/ui/charts/*']: path.resolve(__dirname, 'src/ui/charts/*'),
        ['@/hooks']: path.resolve(__dirname, 'src/hooks'),
        ['@/hooks/*']: path.resolve(__dirname, 'src/hooks/*'),
        ['@/config']: path.resolve(__dirname, 'src/config'),
        ['@/config/*']: path.resolve(__dirname, 'src/config/*'),
    }),
);

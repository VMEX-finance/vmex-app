const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
    addWebpackAlias({
        ['@/api']: path.resolve(__dirname, 'src/api'),
        ['@/pages']: path.resolve(__dirname, 'src/pages'),
        ['@/store']: path.resolve(__dirname, 'src/store'),
        ['@/utils']: path.resolve(__dirname, 'src/utils'),
        ['@/ui/base']: path.resolve(__dirname, 'src/ui/base'),
        ['@/ui/components']: path.resolve(__dirname, 'src/ui/components'),
        ['@/ui/features']: path.resolve(__dirname, 'src/ui/features'),
        ['@/ui/tables']: path.resolve(__dirname, 'src/ui/tables'),
        ['@/ui/templates']: path.resolve(__dirname, 'src/ui/templates'),
        ['@/hooks']: path.resolve(__dirname, 'src/hooks'),
    }),
);

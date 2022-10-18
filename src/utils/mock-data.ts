import { ITrancheProps } from '../models/tranches';

export const lineData = [
    {
        date: '07/20/2022',
        value: 200,
    },
    {
        date: '08/01/2022',
        value: 600,
    },
    {
        date: '08/10/2022',
        value: 1000,
    },
    {
        date: '08/20/2022',
        value: 1200,
    },
    {
        date: '09/01/2022',
        value: 981,
    },
    {
        date: '09/10/2022',
        value: 2500,
    },
    {
        date: '09/20/2022',
        value: 2100,
    },
    {
        date: '10/01/2022',
        value: 981,
    },
    {
        date: '10/10/2022',
        value: 2500,
    },
    {
        date: '10/20/2022',
        value: 2100,
    },
];

export const lineData2 = [
    {
        date: '07/20/2022',
        value: 2000,
    },
    {
        date: '08/01/2022',
        value: 1400,
    },
    {
        date: '08/10/2022',
        value: 1800,
    },
    {
        date: '08/20/2022',
        value: 1500,
    },
    {
        date: '09/01/2022',
        value: 981,
    },
    {
        date: '09/10/2022',
        value: 2000,
    },
    {
        date: '09/20/2022',
        value: 900,
    },
    {
        date: '10/01/2022',
        value: 981,
    },
    {
        date: '10/10/2022',
        value: 2000,
    },
    {
        date: '10/20/2022',
        value: 900,
    },
];

export const mockTopAssets = [
    {
        asset: 'BTC',
        val: '30.2',
    },
    {
        asset: 'XRP',
        val: '10.4',
    },
    {
        asset: 'WBTC',
        val: '9.9',
    },
    {
        asset: 'USDC',
        val: '8.2',
    },
    {
        asset: 'DAI',
        val: '7.3',
    },
    {
        asset: 'AAVE',
        val: '2.2',
    },
];

export const mockTopTranches = [
    {
        name: 'VMEX High',
        borrowed: 30.2,
        supplied: 32.1,
    },
    {
        name: 'VMEX Mid',
        borrowed: 24.9,
        supplied: 28.3,
    },
    {
        name: 'VMEX Low',
        borrowed: 11.4,
        supplied: 12.8,
    },
];

export const _mockAvailableTranche: ITrancheProps = {
    tranche: 'VMEX High Quality',
    assets: ['USDC', 'WBTC', 'AAVE', 'DAI', 'WETH', 'LINK', 'USDT'],
    aggregateRating: 'A+',
    yourActivity: 'none',
    supplyTotal: 22.18,
    borrowTotal: 8.44,
};

export const _mockAvailableTranche2: ITrancheProps = {
    assets: ['WBTC', 'ENJ', 'AAVE', 'UNI', 'WETH', 'DAI'],
    tranche: 'VMEX Mid Quality',
    yourActivity: 'both',
    supplyTotal: 8.73,
    borrowTotal: 4.19,
    aggregateRating: 'C',
};

export const _mockAvailableTranche3: ITrancheProps = {
    assets: ['MANA', 'SNX', 'MKR', 'BAT', 'LINK', 'XRP', 'KNC', 'REN'],
    tranche: 'VMEX Low Quality',
    yourActivity: 'deposited',
    supplyTotal: 17.22,
    borrowTotal: 11.24,
    aggregateRating: 'D',
};

export const _mockTranchesData: Array<ITrancheProps> = [
    _mockAvailableTranche,
    _mockAvailableTranche2,
    _mockAvailableTranche3,
];

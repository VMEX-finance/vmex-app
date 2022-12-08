import { ITrancheProps } from '../../api/models';

export const _mockAvailableTranche: ITrancheProps = {
    id: 1,
    name: 'VMEX High Quality',
    assets: ['USDC', 'WBTC', 'triCrypto2', 'AAVE', 'DAI', 'WETH', 'LINK', 'USDT'],
    aggregateRating: 'A+', //offchain oracle
    yourActivity: 'none', //FE tracking
    tvl: 18.62,
    tvlChange: 3.86, //offchain contracts analytics
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 10.18,
    borrowTotal: 8.44,
    longSupply: 12.99,
    longBorrow: 11.53,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x7d...8F',
    platformFee: 10,
    adminFee: '1.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.85,
    utilization: 78,
    statisticsBorrowed: 1.43,
    reserveFactor: 0.21,
    strategy: '11.12',
};

export const _mockAvailableTranche2: ITrancheProps = {
    id: 2,
    assets: ['WBTC', 'ENJ', 'AAVE', 'UNI', 'WETH', 'DAI'],
    name: 'VMEX Mid Quality',
    yourActivity: 'both',
    tvl: 11.7,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 8.93,
    borrowTotal: 4.69,
    aggregateRating: 'C',
    longSupply: 15.49,
    longBorrow: 10.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x7d...5B',
    platformFee: 11,
    adminFee: '2.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.25,
    utilization: 78,
    statisticsBorrowed: 1.023,
    reserveFactor: 0.21,
    strategy: '8.56',
};

export const _mockAvailableTranche3: ITrancheProps = {
    id: 3,
    assets: ['MANA', 'SNX', 'MKR', 'BAT', 'LINK', 'XRP', 'KNC', 'REN'],
    name: 'VMEX Low Quality',
    yourActivity: 'borrowed',
    tvl: 41.2,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 19.22,
    borrowTotal: 10.24,
    aggregateRating: 'D',
    longSupply: 12.49,
    longBorrow: 11.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x4d...j8',
    platformFee: 12,
    adminFee: '3.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.65,
    utilization: 78,
    statisticsBorrowed: 0.923,
    reserveFactor: 0.21,
    strategy: '7.62',
};
export const _mockAvailableTranche4: ITrancheProps = {
    id: 1,
    name: 'VMEX High Quality 2',
    assets: ['USDC', 'WBTC', 'AAVE', 'DAI', 'WETH', 'LINK', 'USDT'],
    aggregateRating: 'A',
    yourActivity: 'none',
    tvl: 18.62,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 10.18,
    borrowTotal: 8.44,
    longSupply: 12.49,
    longBorrow: 11.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x7d...8F',
    platformFee: 10,
    adminFee: '1.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.85,
    utilization: 78,
    statisticsBorrowed: 1.43,
    reserveFactor: 0.21,
    strategy: '9.49',
};

export const _mockAvailableTranche5: ITrancheProps = {
    id: 2,
    assets: ['WBTC', 'ENJ', 'AAVE', 'UNI', 'WETH', 'DAI'],
    name: 'VMEX Mid Quality 2',
    yourActivity: 'none',
    tvl: 11.7,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 8.73,
    borrowTotal: 4.19,
    aggregateRating: 'B-',
    longSupply: 15.49,
    longBorrow: 10.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x7d...5B',
    platformFee: 11,
    adminFee: '2.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.25,
    utilization: 78,
    statisticsBorrowed: 1.023,
    reserveFactor: 0.21,
    strategy: '8.15',
};

export const _mockAvailableTranche6: ITrancheProps = {
    id: 3,
    assets: ['MANA', 'SNX', 'MKR', 'BAT', 'LINK', 'XRP', 'KNC', 'REN'],
    name: 'VMEX Low Quality 2',
    yourActivity: 'none',
    tvl: 41.2,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 17.22,
    borrowTotal: 11.24,
    aggregateRating: 'D-',
    longSupply: 12.49,
    longBorrow: 11.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x4d...j8',
    platformFee: 12,
    adminFee: '3.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.65,
    utilization: 78,
    statisticsBorrowed: 0.923,
    reserveFactor: 0.21,
    strategy: '0.23',
};
export const _mockAvailableTranche7: ITrancheProps = {
    id: 1,
    name: 'VMEX High Quality 3',
    assets: ['USDC', 'WBTC', 'AAVE', 'DAI', 'WETH', 'LINK', 'USDT'],
    aggregateRating: 'A-',
    yourActivity: 'none',
    tvl: 18.62,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 12.18,
    borrowTotal: 10.44,
    longSupply: 12.49,
    longBorrow: 11.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x7d...8F',
    platformFee: 10,
    adminFee: '1.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.85,
    utilization: 78,
    statisticsBorrowed: 1.43,
    reserveFactor: 0.21,
    strategy: '8.34',
};

export const _mockAvailableTranche8: ITrancheProps = {
    id: 2,
    assets: ['WBTC', 'ENJ', 'AAVE', 'UNI', 'WETH', 'DAI'],
    name: 'VMEX Mid Quality 3',
    yourActivity: 'none',
    tvl: 11.7,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 9.73,
    borrowTotal: 6.19,
    aggregateRating: 'C+',
    longSupply: 15.49,
    longBorrow: 10.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x7d...5B',
    platformFee: 11,
    adminFee: '2.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.25,
    utilization: 78,
    statisticsBorrowed: 1.023,
    reserveFactor: 0.21,
    strategy: '9.53',
};

export const _mockAvailableTranche9: ITrancheProps = {
    id: 3,
    assets: ['MANA', 'SNX', 'MKR', 'BAT', 'LINK', 'XRP', 'KNC', 'REN'],
    name: 'VMEX Low Quality 3',
    yourActivity: 'none',
    tvl: 41.2,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 18.22,
    borrowTotal: 13.24,
    aggregateRating: 'D+',
    longSupply: 12.49,
    longBorrow: 11.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x4d...j8',
    platformFee: 12,
    adminFee: '3.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.65,
    utilization: 78,
    statisticsBorrowed: 0.923,
    reserveFactor: 0.21,
    strategy: '12.34',
};
export const _mockAvailableTranche10: ITrancheProps = {
    id: 3,
    assets: ['MANA', 'SNX', 'MKR', 'BAT', 'LINK', 'XRP', 'KNC', 'REN'],
    name: 'VMEX Low Quality 4',
    yourActivity: 'none',
    tvl: 41.2,
    tvlChange: 3.86,
    supplyChange: 1.02,
    borrowChange: -1.95,
    supplyTotal: 16.92,
    borrowTotal: 12.24,
    aggregateRating: 'D',
    longSupply: 12.49,
    longBorrow: 11.23,
    liquidity: '0.00',
    poolUtilization: '0.00',
    upgradeable: 'Yes',
    admin: '0x4d...j8',
    platformFee: 12,
    adminFee: '3.00',
    oracle: 'Chainlink',
    whitelist: 'Yes',
    ltv: 0,
    liquidThreshold: 0,
    liquidPenalty: 0,
    collateral: 'Yes',
    statisticsSupplied: 1.65,
    utilization: 78,
    statisticsBorrowed: 0.923,
    reserveFactor: 0.21,
    strategy: '14.65',
};

export const MOCK_TRANCHES_DATA: Array<ITrancheProps> = [
    _mockAvailableTranche,
    _mockAvailableTranche2,
    _mockAvailableTranche3,
    _mockAvailableTranche4,
    _mockAvailableTranche5,
    _mockAvailableTranche6,
    _mockAvailableTranche7,
    _mockAvailableTranche8,
    _mockAvailableTranche9,
    _mockAvailableTranche10,
];

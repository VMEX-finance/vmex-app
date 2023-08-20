export const SUBGRAPH_ENDPOINT = process.env.REACT_APP_SUBGRAPH_ENDPOINT;
export const NETWORK = process.env.REACT_APP_NETWORK || 'optimism';
export const USER_REWARDS_URL = 'https://dolphin-app-ajfiy.ondigitalocean.app';

export const HEALTH = {
    GREAT: 5,
    GOOD: 3,
    OKAY: 2,
    BAD: 1.5,
    DEAD: 1,
};

export const EXPLORER_URLS: any = {
    optimism: 'https://optimistic.etherscan.io',
    mainnet: 'https://etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    arbitrum: 'https://arbiscan.io',
};

export const TIMER_CLOSE_DELAY = 1500;

export const AVAILABLE_ASSETS = [
    'AAVE',
    'BAT',
    'BUSD',
    'DAI',
    'ENJ',
    'KNC',
    'LINK',
    'MANA',
    'MKR',
    'REN',
    'SNX',
    'SUSD',
    'TUSD',
    'UNI',
    'USDC',
    'USDT',
    'WBTC',
    'WETH',
    'YFI',
    'ZRX',
    'Tricrypto2',
    'ThreePool',
    'StethEth',
    'Steth',
    'FraxUSDC',
    'Frax3Crv',
    'Frax',
    'BAL',
    'CRV',
    'CVX',
    'BADGER',
    'LDO',
    'ALCX',
    'Oneinch',
];

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MAX_UINT_AMOUNT =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';

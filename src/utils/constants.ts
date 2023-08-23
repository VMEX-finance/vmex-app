import { JsonRpcProvider } from '@ethersproject/providers';

export const SUBGRAPH_ENDPOINT = process.env.REACT_APP_SUBGRAPH_ENDPOINT;
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

export const AVAILABLE_ASSETS: any = {
    sepolia: [
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
    ],
    optimism: [
        'DAI',
        'SUSD',
        'USDC',
        'USDT',
        'WBTC',
        'WETH',
        'yvUSDC',
        'yvUSDT',
        'yvDAI',
        'yvWETH',
        'OP',
        'rETH',
        'LUSD',
        '3CRV',
        'sUSD3CRV-f',
        'wstETHCRV',
        'mooCurveWSTETH',
        'vAMMV2-wstETH/WETH',
        'sAMMV2-USDC/sUSD',
        'vAMMV2-WETH/USDC',
        'sAMMV2-USDC/DAI',
        'vAMMV2-WETH/LUSD',
        'sAMMV2-USDC/LUSD',
        'BPT-WSTETH-WETH',
        'BPT-rETH-ETH',
    ],
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MAX_UINT_AMOUNT =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';

export const NETWORK = process.env.REACT_APP_NETWORK ? process.env.REACT_APP_NETWORK : 'optimism';

export const SDK_PARAMS = {
    network: NETWORK,
    test: process.env.REACT_APP_TEST === 'true' ? true : false,
    providerRpc: process.env.REACT_APP_RPC,
    signer: new JsonRpcProvider(process.env.REACT_APP_RPC).getSigner(),
};

export const PRICING_DECIMALS: any = {
    optimism: 8,
    mainnet: 18,
    sepolia: 18,
};

export const DECIMALS = new Map<string, number>([
    ['AAVE', 18],
    ['BAT', 18],
    ['BUSD', 18],
    ['DAI', 18],
    ['ENJ', 18],
    ['KNC', 18],
    ['LINK', 18],
    ['MANA', 18],
    ['MKR', 18],
    ['REN', 18],
    ['SNX', 18],
    ['SUSD', 18],
    ['TUSD', 18],
    ['UNI', 18],
    ['USDC', 6],
    ['USDT', 6],
    ['WBTC', 8],
    ['WETH', 18],
    ['YFI', 18],
    ['ZRX', 18],
    ['Tricrypto2', 18],
    ['ThreePool', 18],
    ['StethEth', 18],
    ['Steth', 18],
    ['FraxUSDC', 18],
    ['Frax3Crv', 18],
    ['Frax', 18],
    ['BAL', 18],
    ['CRV', 18],
    ['CVX', 18],
    ['BADGER', 18],
    ['LDO', 18],
    ['ALCX', 18],
    ['Oneinch', 18],
    ['yvTricrypto2', 18],
    ['yvThreePool', 18],
    ['yvStethEth', 18],
    ['yvFraxUSDC', 18],
    ['yvFrax3Crv', 18],
    ['yvUSDC', 6],
    ['yvUSDT', 6],
    ['yvDAI', 18],
    ['yvWETH', 18],
    ['OP', 18],
    ['rETH', 18],
    ['LUSD', 18],
    ['3CRV', 18],
    ['sUSD3CRV-f', 18],
    ['wstETHCRV', 18],
    ['mooCurveWSTETH', 18],
    ['vAMMV2-wstETH/WETH', 18],
    ['sAMMV2-USDC/sUSD', 18],
    ['vAMMV2-WETH/USDC', 18],
    ['sAMMV2-USDC/DAI', 18],
    ['vAMMV2-WETH/LUSD', 18],
    ['sAMMV2-USDC/LUSD', 18],
    ['BPT-WSTETH-WETH', 18],
    ['BPT-rETH-ETH', 18],
]);

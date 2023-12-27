import { utils } from 'ethers';

// General
export const TESTING = process.env.REACT_APP_TEST ? true : false;
export const LOGS = process.env.REACT_APP_LOGS ? true : false;

export const HEALTH = {
    GREAT: 5,
    GOOD: 3,
    OKAY: 2,
    BAD: 1.5,
    DEAD: 1,
};

export const TIMER_CLOSE_DELAY = 1500;

export const AVAILABLE_COLLATERAL_TRESHOLD = utils.parseUnits('5000', 8);
export const MAX_UINT_AMOUNT =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';

// Decimals
export const PRICING_DECIMALS: any = {
    optimism: 8,
    base: 8,
    arbitrum: 8,
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
    ['sUSD', 18],
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
    ['USDbC', 6],
    ['cbETH', 18],
    ['vAMM-WETH/USDbC', 18],
    ['vAMM-cbETH/WETH', 18],
]);

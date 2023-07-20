import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { usdFormatter, nativeTokenFormatter } from './helpers';
import { convertAddressToSymbol } from '@vmexfinance/sdk';

export const NETWORK = process.env.REACT_APP_NETWORK ? process.env.REACT_APP_NETWORK : 'mainnet';

export const SDK_PARAMS = {
    network: NETWORK,
    test: process.env.REACT_APP_TEST ? true : false,
    providerRpc: process.env.REACT_APP_RPC,
    signer: new JsonRpcProvider(process.env.REACT_APP_RPC).getSigner(),
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
]);

export const bigNumberToUSD = (
    number: BigNumberish | undefined,
    decimals: number,
    dollarSign = true,
): string => {
    if (!number) {
        console.error('given invalid bignumber');
        return '$0';
    }
    const formatted = usdFormatter(false).format(
        parseFloat(ethers.utils.formatUnits(number, decimals)),
    );
    return dollarSign ? formatted : formatted.slice(1).replaceAll(',', '');
};

export const nativeAmountToUSD = (
    amount: BigNumberish,
    decimals: number,
    assetUSDPrice: BigNumberish,
): number => {
    return parseFloat(
        Number(
            ethers.utils.formatUnits(
                BigNumber.from(amount).mul(assetUSDPrice).div(ethers.utils.parseEther('1')),
                decimals,
            ),
        ).toFixed(2),
    );
};

export const bigNumberToNative = (number: BigNumber | undefined, asset: string): string => {
    if (!number) return '0';
    const decimals = DECIMALS.get(convertAddressToSymbol(asset, SDK_PARAMS.network) || asset) || 18;
    return nativeTokenFormatter.format(parseFloat(ethers.utils.formatUnits(number, decimals)));
};

export const bigNumberToUnformattedString = (
    number: BigNumber | undefined,
    asset: string,
): string => {
    if (!number) {
        console.error('given invalid bignumber');
        return '0';
    }

    if (number.lt(10)) {
        number = BigNumber.from('0');
    }

    return ethers.utils.formatUnits(
        number,
        DECIMALS.get(convertAddressToSymbol(asset, SDK_PARAMS.network) || asset) || 18,
    );
};

export const unformattedStringToBigNumber = (
    number: string | undefined,
    asset: string,
): BigNumber => {
    if (!number) {
        console.error('given invalid number');
        return BigNumber.from('0');
    }

    try {
        return ethers.utils.parseUnits(
            number,
            DECIMALS.get(convertAddressToSymbol(asset, SDK_PARAMS.network) || asset) || 18,
        );
    } catch {
        return BigNumber.from('0');
    }
};

export const rayToPercent = (number: BigNumber): number => {
    return (
        number
            .div(
                BigNumber.from('10000000000000000000000'), // div by 10^22
            )
            .toNumber() / 1000
    ); // div by 10^3 to get percent
};

export const addDollarAmounts = (list: Array<string> | undefined, dollarSign = true) => {
    if (!list) return dollarSign ? `$0` : 0;
    const withoutDollarSign = list.map((el) => parseFloat(el.slice(1).replaceAll(',', '')));
    const sum = withoutDollarSign.reduce((partial, next) => partial + next, 0);
    return dollarSign ? `$${sum.toFixed(2).toString()}` : sum.toFixed(2);
};

export const calculateHealthFactorFromBalances = (
    borrowFactorTimesDebt: BigNumber,
    liquidationThresholdTimesCollateral: BigNumber,
) => {
    if (borrowFactorTimesDebt.lte(BigNumber.from('0'))) {
        return undefined;
    }
    return (
        liquidationThresholdTimesCollateral
            .mul(ethers.utils.parseEther('1'))
            // .div(BigNumber.from('10000'))
            .div(borrowFactorTimesDebt)
    );
};

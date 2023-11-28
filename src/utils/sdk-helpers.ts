import { BigNumber, BigNumberish, ethers, utils } from 'ethers';
import { usdFormatter, nativeTokenFormatter, cleanNumberString } from './helpers';
import { convertAddressToSymbol, convertSymbolToAddress } from '@vmexfinance/sdk';
import { ITrancheCategories } from '@/api';
import { DECIMALS } from './constants';
import { getNetwork } from '@wagmi/core';
import { DEFAULT_NETWORK, getNetworkName } from './network';

export const bigNumberToUSD = (
    number: BigNumberish | undefined,
    decimals: number | string,
    dollarSign = true,
): string => {
    if (!number) {
        console.error('given invalid bignumber');
        return '$0';
    }
    const formatted = usdFormatter(false).format(
        parseFloat(ethers.utils.formatUnits(number, Number(decimals))),
    );
    return dollarSign ? formatted : formatted.slice(1).replaceAll(',', '');
};

export const nativeAmountToUSD = (
    amount: BigNumberish,
    priceDecimals: number,
    assetDecimals: number,
    assetUSDPrice: BigNumberish,
): number => {
    return parseFloat(
        Number(
            ethers.utils.formatUnits(
                BigNumber.from(amount).mul(assetUSDPrice),
                assetDecimals + priceDecimals,
            ),
        ).toFixed(2),
    );
};

export const bigNumberToNative = (number: BigNumber | undefined, asset: string): string => {
    const network = getNetworkName();
    if (!number) return '0';
    const decimals = DECIMALS.get(convertAddressToSymbol(asset, network) || asset) || 18;
    return nativeTokenFormatter.format(parseFloat(ethers.utils.formatUnits(number, decimals)));
};

export const bigNumberToUnformattedString = (
    number: BigNumber | undefined,
    asset: string,
): string => {
    const network = getNetworkName();
    if (!number) {
        console.error('given invalid bignumber');
        return '0';
    }

    if (number.lt(10)) {
        number = BigNumber.from('0');
    }
    const symbol = utils.isAddress(asset) ? convertAddressToSymbol(asset, network) : asset;
    return ethers.utils.formatUnits(number, DECIMALS.get(symbol) || 18);
};

export const toAddress = (asset?: string) => {
    if (!asset) return '';
    if (utils.isAddress(asset)) return asset;
    const network = getNetworkName();
    return convertSymbolToAddress(asset, network);
};

export const toSymbol = (asset?: string) => {
    if (!asset) return '';
    if (!utils.isAddress(asset)) return asset;
    const network = getNetworkName();
    return convertAddressToSymbol(asset, network);
};

export const unformattedStringToBigNumber = (
    number: string | undefined,
    asset: string,
): BigNumber => {
    const network = getNetworkName();
    if (!number) {
        console.error('given invalid number');
        return BigNumber.from('0');
    }
    const _number = cleanNumberString(number);
    try {
        return ethers.utils.parseUnits(_number, DECIMALS.get(toSymbol(asset)) || 18);
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
            .mul(ethers.utils.parseUnits('1', 18))
            // .div(BigNumber.from('10000'))
            .div(borrowFactorTimesDebt)
    );
};

export const getTrancheCategory = (tranche: any, globalAdmin = ''): ITrancheCategories => {
    if (!tranche) return 'Standard';
    if (tranche.trancheAdmin.id === globalAdmin) return 'VMEX';
    if (tranche.isVerified) return 'External';
    return 'Standard';
};

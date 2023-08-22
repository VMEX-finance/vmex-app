import { BigNumber, BigNumberish, ethers } from 'ethers';
import { usdFormatter, nativeTokenFormatter } from './helpers';
import { convertAddressToSymbol } from '@vmexfinance/sdk';
import { ITrancheCategories } from '@app/api';
import { DECIMALS, SDK_PARAMS } from './constants';

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
    priceDecimals: number,
    assetDecimals: number,
    assetUSDPrice: BigNumberish,
): number => {
    return parseFloat(
        Number(
            ethers.utils.formatUnits(
                BigNumber.from(amount)
                    .mul(assetUSDPrice)
                    .div(ethers.utils.parseUnits('1', priceDecimals)),
                assetDecimals,
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

export const getTrancheCategory = (tranche: any, globalAdmin = ''): ITrancheCategories => {
    if (!tranche) return 'Standard';
    if (tranche.isVerified) return 'External';
    else {
        if (tranche.trancheAdmin.id === globalAdmin) return 'VMEX';
        else return 'Standard';
    }
};

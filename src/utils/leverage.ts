import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { IGraphAssetData, IUserTrancheData } from '@/api';
import { convertAddressToSymbol } from '@vmexfinance/sdk';

const DECIMALS = 8;
const DECIMAL_ONE = new Decimal(1);
const DEFAULT_MAX_LEVERAGE = 2.5;
const LEVERAGE_DECIMAL_PLACES = 2;
const defaultReturn = { maxBorrowableAmountUsd: '0', maxLeverage: DEFAULT_MAX_LEVERAGE };

export const getMaxBorrowableAmount = (
    availableBorrows: string | undefined,
    minBorrow: string,
    ltv: BigNumber | undefined,
    assetAmountUsd: string | undefined, // $108.12 -> need to remove $
) => {
    if (!availableBorrows || !ltv) {
        return defaultReturn;
    }

    const minBorrowBN = parseUnits(minBorrow, DECIMALS);
    const availableBorrowsBN = parseEther(availableBorrows);
    const ltvDec = new Decimal(formatEther(ltv));

    if (minBorrowBN.gt(availableBorrowsBN)) {
        console.warn('getMaxBorrowableAmount -> minBorrow greater than availableBorrows');
        return defaultReturn;
    }

    const N = new Decimal(minBorrowBN.toString())
        .dividedBy(availableBorrowsBN.toString())
        .ln()
        .dividedBy(ltvDec.ln())
        .floor();

    const maxBorrowableAmountUsd = formatUnits(
        new Decimal(availableBorrowsBN.toString())
            .times(DECIMAL_ONE.minus(ltvDec.pow(N)))
            .dividedBy(DECIMAL_ONE.minus(ltvDec))
            .floor()
            .toString(),
        DECIMALS,
    );

    const maxLeverage = assetAmountUsd
        ? new Decimal(maxBorrowableAmountUsd)
              .dividedBy(assetAmountUsd.replace('$', ''))
              .plus(1)
              .toDecimalPlaces(LEVERAGE_DECIMAL_PLACES)
              .toNumber()
        : DEFAULT_MAX_LEVERAGE;

    return { maxBorrowableAmountUsd, maxLeverage };
};

export const calculateHealthFactorAfterLeverage = (
    depositAsset: IGraphAssetData,
    borrowAssets: IGraphAssetData[],
    borrowAmountUsd: BigNumber,
    userTrancheData?: IUserTrancheData,
) => {
    if (
        !depositAsset ||
        !borrowAmountUsd ||
        ![1, 2].includes(borrowAssets.length) ||
        !userTrancheData
    ) {
        return;
    }

    let { totalCollateralETH, totalDebtETH, currentLiquidationThreshold, avgBorrowFactor } =
        userTrancheData;

    if (!totalCollateralETH || !currentLiquidationThreshold || !totalDebtETH || !avgBorrowFactor) {
        return;
    }

    const liquidationThresholdTimesCollateralAfter = currentLiquidationThreshold
        .mul(totalCollateralETH)
        .add(borrowAmountUsd.mul(depositAsset.liquidationThreshold));

    let borrowFactorTimesDebtAfter = avgBorrowFactor.mul(totalDebtETH);
    if (borrowAssets.length === 1) {
        borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter.add(
            borrowAmountUsd.mul(borrowAssets[0].borrowFactor),
        );
    } else {
        borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter
            .add(borrowAmountUsd.mul(borrowAssets[0].borrowFactor).div(2))
            .add(borrowAmountUsd.mul(borrowAssets[1].borrowFactor).div(2));
    }

    return liquidationThresholdTimesCollateralAfter
        .mul(parseUnits('1', 18))
        .div(borrowFactorTimesDebtAfter);
};

export const calculateHealthFactorAfterUnwind = (
    depositAsset: IGraphAssetData,
    borrowAsset: IGraphAssetData,
    unwindAmountUsd: BigNumber | undefined,
    userTrancheData?: IUserTrancheData,
) => {
    if (!depositAsset || !unwindAmountUsd || !userTrancheData) {
        return;
    }

    console.log('calculate HF unwind', unwindAmountUsd.toString());

    let { totalCollateralETH, totalDebtETH, currentLiquidationThreshold, avgBorrowFactor } =
        userTrancheData;

    if (!totalCollateralETH || !currentLiquidationThreshold || !totalDebtETH || !avgBorrowFactor) {
        return;
    }

    console.log('old liq tres', currentLiquidationThreshold.mul(totalCollateralETH).toString());
    const liquidationThresholdTimesCollateralAfter = currentLiquidationThreshold
        .mul(totalCollateralETH)
        .sub(unwindAmountUsd.mul(depositAsset.liquidationThreshold));
    console.log('new liq tres', liquidationThresholdTimesCollateralAfter.toString());

    let borrowFactorTimesDebtAfter = avgBorrowFactor.mul(totalDebtETH);
    console.log('old borrow factor times debt', borrowFactorTimesDebtAfter.toString());
    borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter.sub(
        unwindAmountUsd.mul(borrowAsset.borrowFactor),
    );
    console.log('new borrow factor times debt', borrowFactorTimesDebtAfter.toString());

    return liquidationThresholdTimesCollateralAfter
        .mul(parseUnits('1', 18))
        .div(borrowFactorTimesDebtAfter);
};

export const calculateTotalBorrowAmount = (amountHumanReadable: string, leverage: number) => {
    if (!amountHumanReadable || !leverage) return BigNumber.from(0);
    return parseUnits(amountHumanReadable.replace('$', ''), 8)
        .mul((leverage * 100).toFixed(0))
        .div(100);
};

export const isPoolStable = (network: string, token0: string, token1: string) => {
    const token0Symbol = convertAddressToSymbol(token0, network);
    const token1Symbol = convertAddressToSymbol(token1, network);
    const stablecoins = ['usdc', 'usdt', 'susd', 'dai', 'lusd'];
    if (
        stablecoins.includes(token0Symbol.toLowerCase()) &&
        stablecoins.includes(token1Symbol.toLowerCase())
    )
        return true;

    if (token0Symbol.toLowerCase().includes('eth') && token1Symbol.toLowerCase().includes('eth'))
        return true;

    return false;
};

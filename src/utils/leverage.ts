import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';

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

// export const determineHFFinal = () => {
//     if (!asset || !amount) {
//         return undefined;
//     }
//     let a = findAssetInMarketsData(asset);
//     let d = a?.decimals;
//     if (!a || !d || amount == '' || !parseFloat(amount)) {
//         return undefined;
//     }

//     try {
//         let ethAmount;
//         if (PRICING_DECIMALS[network] == 8) {
//             ethAmount = ethers.utils
//                 .parseUnits(convertStringFormatToNumber(amount), d)
//                 .mul(a.priceUSD)
//                 .div(ethers.utils.parseUnits('1', d)); //18 decimals or 8 decimals
//         } else {
//             ethAmount = ethers.utils
//                 .parseUnits(convertStringFormatToNumber(amount), d)
//                 .mul(a.priceETH)
//                 .div(ethers.utils.parseUnits('1', d)); //18 decimals or 8 decimals
//         }
//         if (TESTING) {
//             console.log('amount: ', amount);
//             console.log('ethAmount: ', ethAmount);
//         }

//         let totalCollateralETH = queryUserTrancheData.data?.totalCollateralETH;
//         let totalDebtInETH = queryUserTrancheData.data?.totalDebtETH; //ETH or USD, depending on underlying chainlink decimals
//         let currentLiquidationThreshold =
//             queryUserTrancheData.data?.currentLiquidationThreshold;
//         let currentAvgBorrowFactor = queryUserTrancheData.data?.avgBorrowFactor;

//         if (
//             !totalCollateralETH ||
//             !currentLiquidationThreshold ||
//             !totalDebtInETH ||
//             !currentAvgBorrowFactor
//         ) {
//             return undefined;
//         }

//         let collateralAfter = totalCollateralETH;
//         let debtAfter = totalDebtInETH;
//         let liquidationThresholdTimesCollateralAfter =
//             currentLiquidationThreshold.mul(totalCollateralETH);
//         let borrowFactorTimesDebtAfter = currentAvgBorrowFactor.mul(totalDebtInETH);
//         if (type === 'supply') {
//             collateralAfter = totalCollateralETH.add(ethAmount);
//             liquidationThresholdTimesCollateralAfter =
//                 liquidationThresholdTimesCollateralAfter.add(
//                     ethAmount.mul(a.liquidationThreshold),
//                 );
//         }

//         if (type === 'withdraw') {
//             collateralAfter = totalCollateralETH.sub(ethAmount);
//             liquidationThresholdTimesCollateralAfter =
//                 liquidationThresholdTimesCollateralAfter.sub(
//                     ethAmount.mul(a.liquidationThreshold),
//                 );
//         }

//         if (type === 'borrow') {
//             debtAfter = totalDebtInETH.add(ethAmount);
//             borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter.add(
//                 ethAmount.mul(a.borrowFactor),
//             );
//         }

//         if (type === 'repay') {
//             debtAfter = totalDebtInETH.sub(ethAmount);
//             borrowFactorTimesDebtAfter = borrowFactorTimesDebtAfter.sub(
//                 ethAmount.mul(a.borrowFactor),
//             );
//         }
//         if (TESTING) {
//             console.log('total collateral after calc: ', collateralAfter);
//             console.log('total debtAfter after calc: ', debtAfter);
//             console.log(
//                 'total liquidationThresholdTimesCollateralAfter after calc: ',
//                 liquidationThresholdTimesCollateralAfter,
//             );
//             console.log(
//                 'total borrowFactorTimesDebtAfter after calc: ',
//                 borrowFactorTimesDebtAfter,
//             );
//         }

//         if (type === 'disable collateral') {
//             collateralAfter = totalCollateralETH.sub(ethAmount);
//             liquidationThresholdTimesCollateralAfter =
//                 liquidationThresholdTimesCollateralAfter.sub(
//                     ethAmount.mul(a.liquidationThreshold),
//                 );
//         }

//         if (type === 'enable collateral') {
//             collateralAfter = totalCollateralETH.add(ethAmount);
//             liquidationThresholdTimesCollateralAfter =
//                 liquidationThresholdTimesCollateralAfter.add(
//                     ethAmount.mul(a.liquidationThreshold),
//                 );
//         }
//         let healthFactorAfterDecrease = calculateHealthFactorFromBalances(
//             borrowFactorTimesDebtAfter,
//             liquidationThresholdTimesCollateralAfter, //they both have the same number of decimals
//         );

//         return renderHealth(
//             healthFactorAfterDecrease &&
//                 ethers.utils.formatUnits(healthFactorAfterDecrease, 18), //HF always has 18 decimals
//             size,
//             queryUserTrancheData.isLoading,
//         );
//     } catch {
//         return undefined;
//     }
// };

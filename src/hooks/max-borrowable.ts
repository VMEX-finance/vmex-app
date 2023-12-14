import { TESTING, cleanNumberString } from '@/utils';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';

const DECIMALS = 8;
const DECIMAL_ONE = new Decimal(1);
const DEFAULT_MAX_LEVERAGE = 1;
const LEVERAGE_DECIMAL_PLACES = 2;
const defaultReturn = { maxBorrowableAmountUsd: '0', maxLeverage: DEFAULT_MAX_LEVERAGE };
const MIN_BORROW_BN = parseUnits('5', DECIMALS);

// ltv borrowFactor liquidationBonus are actually all string, but data types are messed up
export const useMaxBorrowableAmount = (
    availableBorrows: string | undefined,
    ltv: BigNumber | undefined,
    borrowFactor: BigNumber | undefined,
    liquidationBonus: BigNumber | undefined,
    assetAmountUsd: string | undefined, // $108.12 -> need to remove $
) => {
    const [maxBorrowable, setMaxBorrowable] = useState(defaultReturn);

    useEffect(() => {
        if (!availableBorrows || !ltv || !borrowFactor || !liquidationBonus) {
            return;
        }

        const availableBorrowsBN = parseEther(cleanNumberString(availableBorrows));
        const effectiveLtvDec = new Decimal(formatEther(ltv))
            .mul(formatEther(borrowFactor))
            .div(formatEther(liquidationBonus));

        if (MIN_BORROW_BN.gt(availableBorrowsBN)) {
            if (TESTING)
                console.warn('getMaxBorrowableAmount -> minBorrow greater than availableBorrows');
            return;
        }

        const N = new Decimal(MIN_BORROW_BN.toString())
            .dividedBy(availableBorrowsBN.toString())
            .ln()
            .dividedBy(effectiveLtvDec.ln())
            .floor();

        const maxBorrowableAmountUsd = cleanNumberString(
            formatUnits(
                new Decimal(cleanNumberString(availableBorrowsBN.toString()))
                    .times(DECIMAL_ONE.minus(effectiveLtvDec.pow(N)))
                    .dividedBy(DECIMAL_ONE.minus(effectiveLtvDec))
                    .floor()
                    .toString(),
                DECIMALS,
            ),
        );

        const maxLeverage =
            assetAmountUsd && cleanNumberString(assetAmountUsd) !== '0.00'
                ? new Decimal(maxBorrowableAmountUsd)
                      .dividedBy(cleanNumberString(assetAmountUsd))
                      .toDecimalPlaces(LEVERAGE_DECIMAL_PLACES)
                      .toNumber()
                : DEFAULT_MAX_LEVERAGE;
        setMaxBorrowable({ maxBorrowableAmountUsd, maxLeverage });
        return;
    }, [availableBorrows, MIN_BORROW_BN, ltv, assetAmountUsd, borrowFactor, liquidationBonus]);

    return maxBorrowable;
};

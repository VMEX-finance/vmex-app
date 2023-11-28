import { cleanNumberString } from '@/utils';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';

const DECIMALS = 8;
const DECIMAL_ONE = new Decimal(1);
const DEFAULT_MAX_LEVERAGE = 2.5;
const LEVERAGE_DECIMAL_PLACES = 2;
const defaultReturn = { maxBorrowableAmountUsd: '0', maxLeverage: DEFAULT_MAX_LEVERAGE };

export const useMaxBorrowableAmount = (
    availableBorrows: string | undefined,
    minBorrow: string,
    ltv: BigNumber | undefined,
    assetAmountUsd: string | undefined, // $108.12 -> need to remove $
) => {
    const [maxBorrowable, setMaxBorrowable] = useState(defaultReturn);

    useEffect(() => {
        if (!availableBorrows || !ltv) {
            return;
        }

        const minBorrowBN = parseUnits(cleanNumberString(minBorrow), DECIMALS);
        const availableBorrowsBN = parseEther(cleanNumberString(availableBorrows));
        const ltvDec = new Decimal(formatEther(ltv));

        if (minBorrowBN.gt(availableBorrowsBN)) {
            console.warn('getMaxBorrowableAmount -> minBorrow greater than availableBorrows');
            return;
        }

        const N = new Decimal(minBorrowBN.toString())
            .dividedBy(availableBorrowsBN.toString())
            .ln()
            .dividedBy(ltvDec.ln())
            .floor();

        const maxBorrowableAmountUsd = cleanNumberString(
            formatUnits(
                new Decimal(cleanNumberString(availableBorrowsBN.toString()))
                    .times(DECIMAL_ONE.minus(ltvDec.pow(N)))
                    .dividedBy(DECIMAL_ONE.minus(ltvDec))
                    .floor()
                    .toString(),
                DECIMALS,
            ),
        );

        const maxLeverage = assetAmountUsd
            ? new Decimal(maxBorrowableAmountUsd)
                  .dividedBy(cleanNumberString(assetAmountUsd))
                  .plus(1)
                  .toDecimalPlaces(LEVERAGE_DECIMAL_PLACES)
                  .toNumber()
            : DEFAULT_MAX_LEVERAGE;
        setMaxBorrowable({ maxBorrowableAmountUsd, maxLeverage });
        return;
    }, [availableBorrows, minBorrow, ltv, assetAmountUsd]);

    return maxBorrowable;
};

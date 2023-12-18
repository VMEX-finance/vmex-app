import { TESTING, cleanNumberString } from '@/utils';
import { Decimal } from 'decimal.js';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';

const DECIMALS = 8;
const DECIMAL_ONE = new Decimal(1);
const DEFAULT_MAX_LOOPING = 3;
const defaultReturn = {
    maxBorrowableAmountUsd: '0',
    maxLooping: DEFAULT_MAX_LOOPING,
    ltv: new Decimal(0.5),
};
const MIN_BORROW_BN = parseUnits('10', DECIMALS); // dont loop under $10

// ltv borrowFactor liquidationBonus are actually all string, but data types are messed up
export const useMaxLooping = (
    availableBorrows: string | undefined,
    ltv: BigNumber | undefined,
    borrowFactor: BigNumber | undefined,
    liquidationBonus: BigNumber | undefined,
    assetAmountUsd: string | undefined, // $108.12 -> need to remove $
) => {
    const [maxLooping, setMaxLooping] = useState(defaultReturn);

    useEffect(() => {
        if (!availableBorrows || !ltv || !borrowFactor || !liquidationBonus) {
            return;
        }

        const availableBorrowsBN = parseEther(cleanNumberString(availableBorrows));
        const effectiveLtvDec = new Decimal(formatEther(ltv))
            .mul(formatEther(borrowFactor))
            .mul(0.9) // for safety
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

        const maxBorrowableAmountUsd = formatUnits(
            new Decimal(cleanNumberString(availableBorrowsBN.toString()))
                .times(DECIMAL_ONE.minus(effectiveLtvDec.pow(N.minus(1))))
                .dividedBy(DECIMAL_ONE.minus(effectiveLtvDec))
                .plus(availableBorrowsBN.toString())
                .floor()
                .toString(),
            DECIMALS,
        );

        setMaxLooping({ maxBorrowableAmountUsd, maxLooping: N.toNumber(), ltv: effectiveLtvDec });
        return;
    }, [availableBorrows, MIN_BORROW_BN, ltv, assetAmountUsd, borrowFactor, liquidationBonus]);

    return maxLooping;
};

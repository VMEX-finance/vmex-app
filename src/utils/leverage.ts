import { BigNumber } from 'ethers';
import { Decimal } from 'decimal.js';

export const getMaxBorrowableAmount = (
    availableBorrows: string,
    minBorrow: string,
    ltv: string,
) => {
    const minBorrowBN = BigNumber.from(minBorrow);
    const availableBorrowsBN = BigNumber.from(availableBorrows);
    const ltvDec = new Decimal(ltv);

    if (minBorrowBN.gt(availableBorrowsBN)) {
        throw new Error('getMaxBorrowableAmount -> minBorrow greater than availableBorrows');
    }

    const N = new Decimal(minBorrowBN.toString())
        .dividedBy(availableBorrowsBN.toString())
        .ln()
        .dividedBy(ltvDec.ln())
        .floor();

    return BigNumber.from(
        new Decimal(availableBorrowsBN.toString())
            .times(new Decimal(1).minus(ltvDec.pow(N)))
            .dividedBy(new Decimal(1).minus(ltvDec))
            .floor()
            .toString(),
    );
};

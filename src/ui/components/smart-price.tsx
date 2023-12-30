import React from 'react';
import { Tooltip } from './tooltip-default';

function SmartPrice({ price, decimals }: { price: string; decimals?: number }) {
    if (price === 'N/A' && !price) return <span>-</span>;
    if (Number(price) === 0) return <span>0.0</span>;
    if (price.includes('$')) return <span>{price}</span>;
    const textClass = 'flex items-center';

    // The case where the price is not too small
    const mustReduce = price.substring(0, 6) === '0.0000';
    if (!mustReduce) {
        if (price.includes('.')) {
            if (Number(price) > 1000000)
                return <span className={textClass}>{price.split('.')[0]}</span>;
            if (decimals)
                return <span className={textClass}>{Number(price).toFixed(decimals)}</span>;
            if (Number(price) > 10000)
                return <span className={textClass}>{Number(price).toFixed(1)}</span>;
            if (Number(price) > 100)
                return <span className={textClass}>{Number(price).toFixed(2)}</span>;
        }
        return <span className={textClass}>{price.substring(0, 8)}</span>;
    }

    // The case where the price needs to be reduced
    let zeroCount = 0;
    let i = 0;
    let endingFour = '';

    for (let mStr = price.substring(3); i < mStr.length; i++) {
        if (mStr[i] === '0') {
            zeroCount++;
        } else {
            endingFour = mStr.substring(i, i + 4);
            break;
        }
    }

    return (
        <Tooltip text={price}>
            <span className={textClass}>
                0.0...
                {/* <sub>{zeroCount}</sub> */}
                {endingFour}
            </span>
        </Tooltip>
    );
}

export { SmartPrice };

import React from "react";
import { ITVLData } from "@ui/features/overview";

export function getTVLData(): ITVLData {
    return {
        tvl: 4642124,
        reserve: 248750,
        lenders: 267,
        borrowers: 473,
        markets: 58
    }
}

export function useMarketOverview() {
    const TVLDataProps = ({...otherProps} = {}) => {
        return {
            ...getTVLData(),
            ...otherProps
        }
    }

    return {
        TVLDataProps
    }
}
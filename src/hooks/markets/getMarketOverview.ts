import React from "react";
import { ITVLData } from "../../components/data/TvlDataComponent";

function getTVLData(): ITVLData {
    return {
        tvl: 4642124,
        reserve: 248750,
        lenders: 267,
        borrowers: 473,
        markets: 58
    }
}

function useMarketOverview() {
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
export default useMarketOverview;
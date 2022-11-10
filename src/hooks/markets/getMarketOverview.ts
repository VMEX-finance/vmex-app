import React from 'react';
import { ITVLData } from '@ui/features/overview';
import { ITrancheTVLData } from '@ui/features/tranche';

export function getTVLData(): ITVLData {
    return {
        tvl: 4642124,
        reserve: 248750,
        lenders: 267,
        borrowers: 473,
        markets: 58,
    };
}

export function getTrancheTVLData(): ITrancheTVLData {
    return {
        tvl: 4642124,
        supplied: 248750,
        borrowed: 267,
        grade: 'A+',
    };
}

export function useTrancheOverview() {
    const TVLDataProps = ({ ...otherProps } = {}) => {
        return {
            ...getTrancheTVLData(),
            ...otherProps,
        };
    };

    return {
        TVLDataProps,
    };
}

export function useMarketOverview() {
    const TVLDataProps = ({ ...otherProps } = {}) => {
        return {
            ...getTVLData(),
            ...otherProps,
        };
    };

    return {
        TVLDataProps,
    };
}

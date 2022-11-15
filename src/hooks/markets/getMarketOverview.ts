import { IProtocolProps, ITrancheOverviewProps } from '../../ui/features';
import { MOCK_LINE_DATA_2, MOCK_TOP_ASSETS, MOCK_TOP_TRANCHES } from '../../utils/mock-data';

export function getTVLData(): IProtocolProps {
    return {
        tvl: 4642124,
        reserve: 248750,
        lenders: 267,
        borrowers: 473,
        markets: 58,
        totalSupplied: 129145000,
        totalBorrowed: 110231029,
        topBorrowedAssets: MOCK_TOP_ASSETS,
        topSuppliedAssets: MOCK_TOP_ASSETS,
        topTranches: MOCK_TOP_TRANCHES,
        graphData: MOCK_LINE_DATA_2,
    };
}

export function getTrancheTVLData(): ITrancheOverviewProps {
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

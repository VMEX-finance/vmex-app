import { useQuery } from '@tanstack/react-query';
import { IProtocolProps } from '../../ui/features';
import { MOCK_LINE_DATA_2, MOCK_TOP_ASSETS, MOCK_TOP_TRANCHES } from '../../utils/mock-data';
import { IProtocolDataProps } from './types';
// import { getTVL } from '@vmex/sdk';
// import { ethers } from 'ethers';
// import { SDK_PARAMS } from '../../utils/sdk-helpers';

export async function getProtocolOverviewData(): Promise<IProtocolProps> {
    // const tvl = await getTVL(SDK_PARAMS);

    return {
        // tvl: Number(ethers.utils.formatEther(tvl)),
        tvl: 239334543,
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

export function useProtocolData(): IProtocolDataProps {
    const queryProtocolOverview = useQuery({
        queryKey: ['protocol-overview'],
        queryFn: getProtocolOverviewData,
    });

    return {
        queryProtocolOverview,
    };
}

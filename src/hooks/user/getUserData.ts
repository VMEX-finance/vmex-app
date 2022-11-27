import { BorrowedAssetData, getUserSummaryData, SuppliedAssetData } from '@vmex/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    rayToPercent,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { IUserPerformanceCardProps } from '../../ui/features';
import {
    MOCK_LINE_DATA,
    MOCK_LINE_DATA_2,
    MOCK_YOUR_BORROWS,
    MOCK_YOUR_SUPPLIES,
} from '../../utils/mock-data';
import { IUserActivityDataProps, IUserDataProps } from './types';

// Gets
export function getUserPerformanceData(): IUserPerformanceCardProps {
    return {
        tranches: [],
        profitLossChart: MOCK_LINE_DATA,
        insuranceChart: MOCK_LINE_DATA_2,
        loanedAssets: MOCK_YOUR_SUPPLIES,
    };
}

export async function getUserActivityData(userAddress: string): Promise<IUserActivityDataProps> {
    console.log('getting user data for addr', userAddress);
    if (!userAddress) {
        return {
            supplies: [],
            borrows: [],
        };
    }

    const summary = await getUserSummaryData({
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
    });
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);
    console.log('got user data', summary);
    return {
        supplies: summary.suppliedAssetData.map((assetData: SuppliedAssetData) => {
            return {
                asset: reverseMapping.get(assetData.asset.toLowerCase()) || assetData.asset,
                amount: bigNumberToUSD(assetData.amount, 18),
                collateral: assetData.isCollateral,
                apy: rayToPercent(assetData.apy),
                tranche: assetData.tranche.toString(),
                trancheId: assetData.tranche.toNumber(),
            };
        }),
        borrows: summary.borrowedAssetData.map((assetData: BorrowedAssetData) => {
            return {
                asset: reverseMapping.get(assetData.asset.toLowerCase()) || assetData.asset,
                amount: bigNumberToUSD(assetData.amount, 18),
                apy: rayToPercent(assetData.apy),
                tranche: assetData.tranche.toString(),
                trancheId: assetData.tranche.toNumber(),
            };
        }),
    };
}

// Master
export function useUserData(userAddress: string): IUserDataProps {
    const queryUserPerformance = useQuery({
        queryKey: ['user-performance'],
        queryFn: getUserPerformanceData,
    });

    const queryUserActivity = useQuery({
        queryKey: ['user-activity'],
        queryFn: () => getUserActivityData(userAddress),
    });

    return {
        queryUserPerformance,
        queryUserActivity,
    };
}

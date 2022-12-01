import { getUserTrancheData, UserTrancheData, AvailableBorrowData } from '@vmex/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    bigNumberToNative,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    DECIMALS,
    rayToPercent,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';
import { IUserTrancheDataProps, IUserTrancheData } from './types';

export async function _getUserTrancheData(
    userAddress: string,
    trancheId: number,
): Promise<IUserTrancheData> {
    console.log('getting user tranche data for addr', userAddress);
    if (!userAddress) {
        return {
            healthFactor: '0',
            assetBorrowingPower: [],
        };
    }
    const userTrancheData: UserTrancheData = await getUserTrancheData({
        tranche: trancheId.toString(),
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
    });

    console.log('Got user tranche data: ', userTrancheData);
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    const tmp = userTrancheData.assetBorrowingPower.map((marketData: AvailableBorrowData) => {
        console.log(reverseMapping.get(marketData.asset.toLowerCase()));
        console.log(
            DECIMALS.get(reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset) ||
                18,
        );
        console.log(marketData.amountNative);
        return {
            asset: reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset,

            amountUSD: bigNumberToUSD(marketData.amountUSD, 18),
            amountNative: bigNumberToNative(
                marketData.amountNative,
                DECIMALS.get(
                    reverseMapping.get(marketData.asset.toLowerCase()) || marketData.asset,
                ) || 18,
            ),
        };
    });

    return {
        healthFactor: userTrancheData.healthFactor.toString(),
        assetBorrowingPower: tmp,
    };
}

export function useUserTrancheData(userAddress: string, trancheId: number): IUserTrancheDataProps {
    const queryUserTrancheData = useQuery({
        queryKey: ['user-tranche', userAddress, trancheId],
        queryFn: () => _getUserTrancheData(userAddress, trancheId),
        refetchOnMount: true,
    });

    return {
        queryUserTrancheData,
    };
}

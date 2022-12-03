import {
    getUserTrancheData,
    UserTrancheData,
    AvailableBorrowData,
    BorrowedAssetData,
    SuppliedAssetData,
} from '@vmex/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    bigNumberToNative,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    DECIMALS,
    rayToPercent,
    SDK_PARAMS,
    REVERSE_MAINNET_ASSET_MAPPINGS,
} from '../../utils/sdk-helpers';
import { IUserTrancheDataProps, IUserTrancheData } from './types';
import { BigNumber } from 'ethers';

export async function _getUserTrancheData(
    userAddress: string,
    trancheId: number,
): Promise<IUserTrancheData> {
    if (!userAddress) {
        return {
            totalCollateralETH: BigNumber.from('0'),
            totalDebtETH: BigNumber.from('0'),
            currentLiquidationThreshold: BigNumber.from('0'),
            healthFactor: '0',
            supplies: [],
            borrows: [],
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
        totalCollateralETH: userTrancheData.totalCollateralETH,
        totalDebtETH: userTrancheData.totalDebtETH,
        currentLiquidationThreshold: userTrancheData.currentLiquidationThreshold,
        healthFactor: bigNumberToNative(userTrancheData.healthFactor, 18), //health factor has 18 decimals.
        supplies: userTrancheData.suppliedAssetData.map((assetData: SuppliedAssetData) => {
            return {
                asset: reverseMapping.get(assetData.asset.toLowerCase()) || assetData.asset,
                amount: bigNumberToUSD(assetData.amount, 18),
                amountNative: bigNumberToNative(
                    assetData.amountNative,
                    DECIMALS.get(
                        REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                            assetData.asset,
                    ) || 18,
                ),
                collateral: assetData.isCollateral,
                apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                tranche: assetData.tranche.toString(),
                trancheId: assetData.tranche.toNumber(),
                // collateralCap: assetData.collateralCap,
            };
        }),
        borrows: userTrancheData.borrowedAssetData.map((assetData: BorrowedAssetData) => {
            return {
                asset: reverseMapping.get(assetData.asset.toLowerCase()) || assetData.asset,
                amount: bigNumberToUSD(assetData.amount, 18),
                amountNative: bigNumberToNative(
                    assetData.amountNative,
                    DECIMALS.get(
                        REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                            assetData.asset,
                    ) || 18,
                ),
                apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                tranche: assetData.tranche.toString(),
                trancheId: assetData.tranche.toNumber(),
            };
        }),
        assetBorrowingPower: tmp,
    };
}

export function useUserTrancheData(userAddress: any, trancheId: number): IUserTrancheDataProps {
    const queryUserTrancheData = useQuery({
        queryKey: ['user-tranche', userAddress, trancheId],
        queryFn: () => _getUserTrancheData(userAddress, trancheId),
        refetchOnMount: true,
    });

    return {
        queryUserTrancheData,
    };
}

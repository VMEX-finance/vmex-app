import {
    getUserTrancheData,
    UserTrancheData,
    AvailableBorrowData,
    BorrowedAssetData,
    SuppliedAssetData,
} from '@vmexfinance/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    rayToPercent,
    SDK_PARAMS,
    REVERSE_MAINNET_ASSET_MAPPINGS,
    bigNumberToUnformattedString,
} from '../../utils/sdk-helpers';
import { IUserTrancheData, IUserTranchesDataProps } from './types';
import { BigNumber } from 'ethers';

export async function _getUserTranchesData(
    userAddress: string,
    trancheIds: number[],
): Promise<IUserTrancheData[]> {
    if (!userAddress || trancheIds?.length === 0) {
        return [];
    }

    const allTranchesData = await Promise.all(
        trancheIds.map(async (id) => {
            const userTrancheData: UserTrancheData = await getUserTrancheData({
                tranche: String(id),
                user: userAddress,
                network: SDK_PARAMS.network,
                test: SDK_PARAMS.test,
                providerRpc: SDK_PARAMS.providerRpc,
            });

            const returnObj = {
                totalCollateralETH: userTrancheData.totalCollateralETH,
                totalDebtETH: userTrancheData.totalDebtETH,
                currentLiquidationThreshold: userTrancheData.currentLiquidationThreshold,
                healthFactor: bigNumberToUnformattedString(userTrancheData.healthFactor, 'ETH'), //health factor has 18 decimals.
                avgBorrowFactor: userTrancheData.avgBorrowFactor,
                supplies: userTrancheData.suppliedAssetData.map((assetData: SuppliedAssetData) => {
                    return {
                        asset:
                            REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                            assetData.asset,
                        amount: bigNumberToUSD(assetData.amount, 18),
                        amountNative: assetData.amountNative,
                        collateral: assetData.isCollateral,
                        apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                        tranche: assetData.tranche.toString(),
                        trancheId: assetData.tranche.toNumber(),
                    };
                }),
                borrows: userTrancheData.borrowedAssetData.map((assetData: BorrowedAssetData) => {
                    return {
                        asset:
                            REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                            assetData.asset,
                        amount: bigNumberToUSD(assetData.amount, 18),
                        amountNative: assetData.amountNative,
                        apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                        tranche: assetData.tranche.toString(),
                        trancheId: assetData.tranche.toNumber(),
                    };
                }),
                assetBorrowingPower: userTrancheData.assetBorrowingPower.map(
                    (marketData: AvailableBorrowData) => {
                        let asset =
                            REVERSE_MAINNET_ASSET_MAPPINGS.get(marketData.asset.toLowerCase()) ||
                            marketData.asset;
                        return {
                            asset: asset,
                            amountUSD: bigNumberToUSD(marketData.amountUSD, 18),
                            amountNative: marketData.amountNative,
                        };
                    },
                ),
            };
            return returnObj;
        }),
    );

    return allTranchesData;
}

export function useUserTranchesData(
    userAddress: any,
    trancheIds: number[],
): IUserTranchesDataProps {
    const queryUserTranchesData = useQuery({
        queryKey: ['user-tranches'],
        queryFn: () => _getUserTranchesData(userAddress, trancheIds),
        refetchOnMount: true,
    });

    return {
        queryUserTranchesData,
    };
}

import {
    getUserTrancheData,
    UserTrancheData,
    AvailableBorrowData,
    BorrowedAssetData,
    SuppliedAssetData,
    getUserSummaryData,
    convertAddressToSymbol,
} from '@vmexfinance/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    rayToPercent,
    NETWORKS,
    bigNumberToUnformattedString,
    PRICING_DECIMALS,
    DEFAULT_NETWORK,
} from '../../utils';
import { IUserTrancheData, IUserTranchesDataProps } from './types';
import { BigNumber } from 'ethers';
import { getNetwork } from '@wagmi/core';

export async function _getUserTranchesData(
    userAddress: string,
    trancheIds: number[],
): Promise<IUserTrancheData[]> {
    const network = getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    if (!userAddress) return [];
    let _trancheIds;
    if (trancheIds?.length === 0) {
        const summary = await getUserSummaryData({
            user: userAddress,
            network,
            test: NETWORKS[network].testing,
            providerRpc: NETWORKS[network].rpc,
        });

        const tranchesInteractedWith = [...summary.borrowedAssetData, ...summary.suppliedAssetData]
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex((t) => t.tranche.toNumber() === value.tranche.toNumber()),
            )
            .map((assetData) => assetData.tranche.toNumber());

        _trancheIds = tranchesInteractedWith;
    } else {
        _trancheIds = trancheIds;
    }

    const allTranchesData = await Promise.all(
        _trancheIds.map(async (id) => {
            const userTrancheData: UserTrancheData = await getUserTrancheData({
                tranche: String(id),
                user: userAddress,
                network,
                test: NETWORKS[network].testing,
                providerRpc: NETWORKS[network].rpc,
            });

            const returnObj = {
                trancheId: id,
                totalCollateralETH: userTrancheData.totalCollateralETH,
                totalDebtETH: userTrancheData.totalDebtETH,
                currentLiquidationThreshold: userTrancheData.currentLiquidationThreshold,
                healthFactor: bigNumberToUnformattedString(userTrancheData.healthFactor, 'ETH'), //health factor has 18 decimals.
                avgBorrowFactor: userTrancheData.avgBorrowFactor,
                supplies: userTrancheData.suppliedAssetData.map((assetData: SuppliedAssetData) => {
                    return {
                        asset: convertAddressToSymbol(assetData.asset, network),
                        amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[network]),
                        amountNative: assetData.amountNative,
                        collateral: assetData.isCollateral,
                        apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                        tranche: assetData.tranche.toString(),
                        trancheId: assetData.tranche.toNumber(),
                    };
                }),
                borrows: userTrancheData.borrowedAssetData.map((assetData: BorrowedAssetData) => {
                    return {
                        asset: convertAddressToSymbol(assetData.asset, network),
                        amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[network]),
                        amountNative: assetData.amountNative,
                        apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                        tranche: assetData.tranche.toString(),
                        trancheId: assetData.tranche.toNumber(),
                    };
                }),
                assetBorrowingPower: userTrancheData.assetBorrowingPower.map(
                    (marketData: AvailableBorrowData) => {
                        let asset = convertAddressToSymbol(marketData.asset, network);
                        return {
                            asset: asset,
                            amountUSD: bigNumberToUSD(
                                marketData.amountUSD,
                                PRICING_DECIMALS[network],
                            ),
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
    trancheIds?: number[],
): IUserTranchesDataProps {
    const queryUserTranchesData = useQuery({
        queryKey: ['user-tranches'],
        queryFn: () => _getUserTranchesData(userAddress, trancheIds || []),
        refetchOnMount: true,
    });

    return {
        queryUserTranchesData,
    };
}

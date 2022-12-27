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
    rayToPercent,
    SDK_PARAMS,
    REVERSE_MAINNET_ASSET_MAPPINGS,
    bigNumberToUnformattedString,
} from '../../utils/sdk-helpers';
import { IUserTrancheDataProps, IUserTrancheData } from './types';
import { BigNumber } from 'ethers';
import { DECIMALS } from '../../utils/sdk-helpers';

export async function _getUserTrancheData(
    userAddress: string,
    trancheId: number,
): Promise<IUserTrancheData> {
    if (!userAddress || !trancheId) {
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
        tranche: String(trancheId),
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
    });

    const tmp = userTrancheData.assetBorrowingPower.map((marketData: AvailableBorrowData) => {
        let asset =
            REVERSE_MAINNET_ASSET_MAPPINGS.get(marketData.asset.toLowerCase()) || marketData.asset;
        return {
            asset: asset,
            amountUSD: bigNumberToUSD(marketData.amountUSD, DECIMALS.get(asset) || 18),
            amountNative: marketData.amountNative,
        };
    });

    const returnObj = {
        totalCollateralETH: userTrancheData.totalCollateralETH,
        totalDebtETH: userTrancheData.totalDebtETH,
        currentLiquidationThreshold: userTrancheData.currentLiquidationThreshold,
        healthFactor: bigNumberToUnformattedString(userTrancheData.healthFactor, 'ETH'), //health factor has 18 decimals.
        supplies: userTrancheData.suppliedAssetData.map((assetData: SuppliedAssetData) => {
            return {
                asset:
                    REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                    assetData.asset,
                amount: bigNumberToUSD(
                    assetData.amount,
                    DECIMALS.get(
                        REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                            assetData.asset,
                    ) || 18,
                ),
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
                amount: bigNumberToUSD(
                    assetData.amount,
                    DECIMALS.get(
                        REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                            assetData.asset,
                    ) || 18,
                ),
                amountNative: assetData.amountNative,
                apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                tranche: assetData.tranche.toString(),
                trancheId: assetData.tranche.toNumber(),
            };
        }),
        assetBorrowingPower: tmp,
    };
    console.log('_getUserTrancheData:', returnObj);
    return returnObj;
}

export function useUserTrancheData(userAddress: any, trancheId: number): IUserTrancheDataProps {
    const queryUserTrancheData = useQuery({
        queryKey: ['user-tranche', userAddress, trancheId],
        queryFn: () => _getUserTrancheData(userAddress, trancheId),
        refetchOnMount: true,
    });

    const findAssetInUserSuppliesOrBorrows = (asset: string, type: 'supply' | 'borrow') => {
        if (queryUserTrancheData.isLoading) return undefined;
        else {
            const userData =
                type === 'supply'
                    ? queryUserTrancheData.data?.supplies
                    : queryUserTrancheData.data?.borrows;
            return userData?.find((el) => el.asset.toLowerCase() === asset.toLowerCase());
        }
    };

    const findAmountBorrowable = (
        asset: string,
        liquidity: string | undefined,
        liquidityNative: BigNumber | undefined,
    ) => {
        if (queryUserTrancheData.isLoading)
            return {
                amountNative: BigNumber.from('0'),
                amount: '$0',
            };
        else {
            const userWalletData = queryUserTrancheData.data?.assetBorrowingPower;
            const found = userWalletData?.find(
                (el) => el.asset.toLowerCase() === asset.toLowerCase(),
            );
            if (found && liquidity && liquidityNative) {
                return {
                    amount: found?.amountNative.lt(liquidityNative) ? found?.amountUSD : liquidity,
                    amountNative: found?.amountNative.lt(liquidityNative)
                        ? found?.amountNative
                        : liquidityNative,
                };
            } else
                return {
                    amountNative: BigNumber.from('0'),
                    amount: '$0',
                };
        }
    };

    return {
        queryUserTrancheData,
        findAssetInUserSuppliesOrBorrows,
        findAmountBorrowable,
    };
}

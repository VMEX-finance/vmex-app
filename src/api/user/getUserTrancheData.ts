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
import { IUserTrancheDataProps, IUserTrancheData } from './types';
import { BigNumber, ethers } from 'ethers';

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
            avgBorrowFactor: BigNumber.from('0'),
            supplies: [],
            borrows: [],
            assetBorrowingPower: [],
            trancheId: 0,
        };
    }

    const userTrancheData: UserTrancheData = await getUserTrancheData({
        tranche: String(trancheId),
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    });

    const returnObj = {
        trancheId,
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
}

export function useUserTrancheData(userAddress: any, trancheId: number): IUserTrancheDataProps {
    const queryUserTrancheData = useQuery({
        queryKey: ['user-tranche', Number(trancheId)],
        queryFn: () => _getUserTrancheData(userAddress, trancheId),
        refetchOnMount: true,
    });

    const findAssetInUserSuppliesOrBorrows = (
        asset: string | undefined,
        type: 'supply' | 'borrow',
    ) => {
        if (queryUserTrancheData.isLoading || !asset) return undefined;
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
        liquidityNative: BigNumber | undefined, //in native units
        decimals: string | undefined,
        price: BigNumber | undefined, //asset price in USD
    ) => {
        if (queryUserTrancheData.isLoading)
            return {
                amountNative: BigNumber.from('0'),
                amount: '$0',
                loading: true,
            };
        else {
            const userWalletData = queryUserTrancheData.data?.assetBorrowingPower;
            const found = userWalletData?.find(
                (el) => el.asset.toLowerCase() === asset.toLowerCase(),
            );
            if (found && liquidityNative && price && decimals) {
                const liquidity = BigNumber.from(liquidityNative)
                    .mul(price)
                    .div(ethers.utils.parseEther('1'));
                return {
                    amount: found?.amountNative.lt(liquidityNative)
                        ? found?.amountUSD
                        : ethers.utils.formatUnits(liquidity.toString(), decimals),
                    amountNative: found?.amountNative.lt(liquidityNative)
                        ? found?.amountNative
                        : BigNumber.from(liquidityNative),
                    loading: false,
                };
            } else
                return {
                    amountNative: BigNumber.from('0'),
                    amount: '$0',
                    loading: false,
                };
        }
    };

    return {
        queryUserTrancheData,
        findAssetInUserSuppliesOrBorrows,
        findAmountBorrowable,
    };
}

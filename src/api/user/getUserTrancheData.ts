import {
    getUserTrancheData,
    UserTrancheData,
    AvailableBorrowData,
    BorrowedAssetData,
    SuppliedAssetData,
    convertAddressToSymbol,
    MAINNET_ASSET_MAPPINGS,
    getUserIncentives,
} from '@vmexfinance/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    rayToPercent,
    SDK_PARAMS,
    bigNumberToUnformattedString,
} from '../../utils/sdk-helpers';
import { IUserTrancheDataProps, IUserTrancheData } from './types';
import { BigNumber, ethers } from 'ethers';
import { getSubgraphRewardData } from '../subgraph/getRewardsData';
import { VmexRewardsData } from '../types';

export async function _getUserTrancheData(
    userAddress: string,
    _trancheId: number | string,
): Promise<IUserTrancheData> {
    const trancheId = String(_trancheId);
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
        tranche: trancheId,
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    });

    const returnObj = {
        trancheId: Number(trancheId),
        totalCollateralETH: userTrancheData.totalCollateralETH,
        totalDebtETH: userTrancheData.totalDebtETH,
        currentLiquidationThreshold: userTrancheData.currentLiquidationThreshold,
        healthFactor: bigNumberToUnformattedString(userTrancheData.healthFactor, 'ETH'), //health factor has 18 decimals.
        avgBorrowFactor: userTrancheData.avgBorrowFactor,
        supplies: userTrancheData.suppliedAssetData.map((assetData: SuppliedAssetData) => {
            return {
                asset: convertAddressToSymbol(assetData.asset, SDK_PARAMS.network),
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
                asset: convertAddressToSymbol(assetData.asset, SDK_PARAMS.network),
                amount: bigNumberToUSD(assetData.amount, 18),
                amountNative: assetData.amountNative,
                apy: rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0)),
                tranche: assetData.tranche.toString(),
                trancheId: assetData.tranche.toNumber(),
            };
        }),
        assetBorrowingPower: userTrancheData.assetBorrowingPower.map(
            (marketData: AvailableBorrowData) => {
                let asset = convertAddressToSymbol(marketData.asset, SDK_PARAMS.network);
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

export function useUserTrancheData(
    userAddress: any,
    trancheId: number | string,
): IUserTrancheDataProps {
    const queryUserTrancheData = useQuery({
        queryKey: ['user-tranche', Number(trancheId)],
        queryFn: () => _getUserTrancheData(userAddress, trancheId),
        refetchOnMount: true,
    });

    const queryRewardsData = useQuery({
        queryKey: ['rewards', Number(trancheId)],
        queryFn: () => getSubgraphRewardData(),
        refetchOnMount: true,
    });

    const queryUserRewardsData = useQuery({
        queryKey: ['user-rewards', Number(trancheId)],
        queryFn: () =>
            getUserIncentives({
                user: userAddress,
                incentivizedATokens:
                    queryRewardsData.data?.map<string>((el: VmexRewardsData): string => {
                        return el.aTokenAddress;
                    }) || [],
                network: SDK_PARAMS.network,
                test: SDK_PARAMS.test,
                providerRpc: SDK_PARAMS.providerRpc,
            }),
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

    const findAssetInRewards = (
        asset: string | undefined,
        trancheId: string | undefined,
        type: 'supply' | 'borrow',
    ): boolean => {
        if (queryRewardsData.isLoading || !asset || !trancheId || type === 'borrow') return false;
        else {
            const rewardsData = queryRewardsData.data || [];
            const assetAddress = MAINNET_ASSET_MAPPINGS.get(asset)?.toLowerCase();
            const currentUnixTime = Date.now() / 1000;
            return (
                rewardsData.find(
                    (el: VmexRewardsData) =>
                        el.underlyingAssetAddress.toLowerCase() === assetAddress &&
                        el.trancheId === trancheId &&
                        el.emissionsEndTimestamp > currentUnixTime,
                ) !== undefined
            );
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
        queryUserRewardsData,
        queryRewardsData,
        findAssetInUserSuppliesOrBorrows,
        findAmountBorrowable,
        findAssetInRewards,
    };
}

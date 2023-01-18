import {
    BorrowedAssetData,
    getUserSummaryData,
    SuppliedAssetData,
    getUserWalletData,
    UserWalletData,
} from '@vmexfinance/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    rayToPercent,
    SDK_PARAMS,
    bigNumberToNative,
    REVERSE_MAINNET_ASSET_MAPPINGS,
} from '../../utils/sdk-helpers';
import { IUserActivityDataProps, IUserDataProps, IUserWalletDataProps } from './types';
import { BigNumber } from 'ethers';
import { AVAILABLE_ASSETS } from '../../utils/constants';
import { getSubgraphTranchesOverviewData } from '../subgraph';
import { averageOfArr } from '../../utils/helpers';

// Gets
export async function getUserActivityData(userAddress: string): Promise<IUserActivityDataProps> {
    if (!userAddress) {
        return {
            supplies: [],
            borrows: [],
            availableBorrowsETH: '0',
            totalCollateralETH: '0',
            totalDebtETH: '0',
            tranchesInteractedWith: [],
            avgApy: 0,
            avgHealth: 0,
        };
    }

    const tranchesDat = await getSubgraphTranchesOverviewData();
    const summary = await getUserSummaryData({
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    });

    // const allTrancheData = await getAllTrancheData(SDK_PARAMS);
    // const findAssetInTranche = (searchAsset: string, trancheId: number): string => {
    //     let trancheName = 'N/A';
    //     allTrancheData.map((tranche: any) => {
    //         if (tranche.id.toNumber() === trancheId) {
    //             tranche.assets.map((asset: any) => {
    //                 if (searchAsset === asset) {
    //                     trancheName = tranche.name;
    //                 }
    //             });
    //         }
    //     });
    //     return trancheName;
    // };

    const tranchesInteractedWith = [
        ...summary.borrowedAssetData,
        ...summary.suppliedAssetData,
    ].filter(
        (value, index, self) =>
            index === self.findIndex((t) => t.tranche.toNumber() === value.tranche.toNumber()),
    );

    const healths: number[] = [];
    const apys: number[] = [];

    const supplies = summary.suppliedAssetData.map((assetData: SuppliedAssetData) => {
        const apy = rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0));
        apys.push(apy);
        return {
            asset:
                REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                assetData.asset,
            amount: bigNumberToUSD(assetData.amount, 18),
            amountNative: assetData.amountNative,
            collateral: assetData.isCollateral,
            apy,
            tranche: tranchesDat[assetData.tranche.toNumber()].name || '',
            trancheId: assetData.tranche.toNumber(),
            // supplyCap: assetData.supplyCap,
        };
    });

    const borrows = summary.borrowedAssetData.map((assetData: BorrowedAssetData) => {
        const apy = rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0));
        apys.push(apy);
        return {
            asset:
                REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                assetData.asset,
            amount: bigNumberToUSD(assetData.amount, 18),
            amountNative: assetData.amountNative,
            apy,
            tranche: tranchesDat[assetData.tranche.toNumber()].name || '',
            trancheId: assetData.tranche.toNumber(),
        };
    });

    return {
        availableBorrowsETH: bigNumberToNative(summary.availableBorrowsETH, 'ETH'),
        totalCollateralETH: bigNumberToNative(summary.totalCollateralETH, 'ETH'),
        totalDebtETH: bigNumberToNative(summary.totalDebtETH, 'ETH'),
        supplies,
        borrows,
        tranchesInteractedWith: tranchesInteractedWith.map((assetData) => ({
            tranche: tranchesDat[assetData.tranche.toNumber()].name || '',
            id: assetData.tranche.toNumber(),
        })),
        avgApy: averageOfArr(apys),
        avgHealth: 0, // TODO: get average health factor across all tranches
    };
}

export async function _getUserWalletData(
    userAddress: string | undefined,
): Promise<IUserWalletDataProps> {
    if (!userAddress) {
        return {
            assets: [],
        };
    }

    const res = await getUserWalletData({
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    });

    return {
        assets: res.map((assetData: UserWalletData) => {
            return {
                asset:
                    REVERSE_MAINNET_ASSET_MAPPINGS.get(assetData.asset.toLowerCase()) ||
                    assetData.asset,
                amount: bigNumberToUSD(assetData.amount, 18),
                amountNative: assetData.amountNative,
                currentPrice: assetData.currentPrice,
            };
        }),
    };
}

// Master
export function useUserData(userAddress: any): IUserDataProps {
    const queryUserActivity = useQuery({
        queryKey: ['user-activity'],
        queryFn: () => getUserActivityData(userAddress),
        enabled: !!userAddress,
    });

    const queryUserWallet = useQuery({
        queryKey: ['user-wallet'],
        queryFn: () => _getUserWalletData(userAddress),
        enabled: !!userAddress,
    });

    const getTokenBalance = (asset: string) => {
        if (queryUserWallet.isLoading)
            return {
                amountNative: BigNumber.from('0'),
                amount: '$0',
                loading: true,
            };
        if (!AVAILABLE_ASSETS.includes(asset) || !queryUserWallet.data) {
            if (queryUserWallet.data) console.warn(`Token Balance for ${asset} not found`);
            return {
                amountNative: BigNumber.from('0'),
                amount: '$0',
                loading: false,
            };
        } else {
            const found = queryUserWallet.data.assets.find((el) => el.asset === asset);
            return {
                amountNative: found?.amountNative || BigNumber.from('0'),
                amount: found?.amount || '$0',
                loading: false,
            };
        }
    };

    return {
        queryUserActivity,
        queryUserWallet,
        getTokenBalance,
    };
}

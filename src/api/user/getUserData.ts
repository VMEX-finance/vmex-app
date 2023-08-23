import {
    BorrowedAssetData,
    getUserSummaryData,
    SuppliedAssetData,
    getUserWalletData,
    UserWalletData,
    convertAddressToSymbol,
} from '@vmexfinance/sdk';
import { useQuery } from '@tanstack/react-query';
import {
    bigNumberToUSD,
    rayToPercent,
    SDK_PARAMS,
    bigNumberToNative,
    averageOfArr,
    PRICING_DECIMALS,
    NETWORK,
} from '../../utils';
import { IUserActivityDataProps, IUserDataProps, IUserWalletDataProps } from './types';
import { BigNumber } from 'ethers';
import { getSubgraphTranchesOverviewData } from '../subgraph';

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
        };
    }

    const tranchesDat = await getSubgraphTranchesOverviewData();
    const summary = await getUserSummaryData({
        user: userAddress,
        network: SDK_PARAMS.network,
        test: SDK_PARAMS.test,
        providerRpc: SDK_PARAMS.providerRpc,
    });

    const apys: number[] = [];
    const tranchesInteractedWith = [...summary.borrowedAssetData, ...summary.suppliedAssetData]
        .filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.tranche.toNumber() === value.tranche.toNumber()),
        )
        .map((assetData) => ({
            tranche: tranchesDat[assetData.tranche.toNumber()].name || '',
            id: assetData.tranche.toNumber(),
        }));

    const supplies = summary.suppliedAssetData.map((assetData: SuppliedAssetData) => {
        const apy = rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0));
        apys.push(apy);
        return {
            asset: convertAddressToSymbol(assetData.asset, SDK_PARAMS.network),
            amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[NETWORK]),
            amountNative: assetData.amountNative,
            collateral: assetData.isCollateral,
            apy,
            tranche: tranchesDat[assetData.tranche.toNumber()].name || '',
            trancheId: assetData.tranche.toNumber(),
            // supplyCap: assetData.supplyCap,
        };
    });
    console.log('supplies: ', supplies);

    const borrows = summary.borrowedAssetData.map((assetData: BorrowedAssetData) => {
        const apy = rayToPercent(assetData.apy ? assetData.apy : BigNumber.from(0));
        apys.push(apy);
        return {
            asset: convertAddressToSymbol(assetData.asset, SDK_PARAMS.network),
            amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[NETWORK]),
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
        tranchesInteractedWith,
        avgApy: averageOfArr(apys),
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
                asset: convertAddressToSymbol(assetData.asset, SDK_PARAMS.network),
                amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[NETWORK]),
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
        if (!queryUserWallet.data) {
            if (queryUserWallet.data) console.warn(`Token Balance for ${asset} not found`);
            return {
                amountNative: BigNumber.from('0'),
                amount: '$0',
                loading: false,
            };
        } else {
            const found = queryUserWallet.data.assets.find(
                (el) => el.asset.toLowerCase() === asset.toLowerCase(),
            );
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

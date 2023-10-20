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
    NETWORKS,
    bigNumberToNative,
    averageOfArr,
    PRICING_DECIMALS,
    DEFAULT_NETWORK,
} from '@/utils';
import { IUserActivityDataProps, IUserDataProps, IUserWalletDataProps } from './types';
import { BigNumber } from 'ethers';
import { getSubgraphTranchesOverviewData } from '../subgraph';
import { getNetwork } from '@wagmi/core';

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
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;

    const tranchesDat = await getSubgraphTranchesOverviewData();
    const summary = await getUserSummaryData({
        user: userAddress,
        network,
        test: NETWORKS[network].testing,
        providerRpc: NETWORKS[network].rpc,
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
            asset: convertAddressToSymbol(assetData.asset, network),
            amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[network]),
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
            asset: convertAddressToSymbol(assetData.asset, network),
            amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[network]),
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
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;

    const res = await getUserWalletData({
        user: userAddress,
        network,
        test: NETWORKS[network].testing,
        providerRpc: NETWORKS[network].rpc,
    });

    return {
        assets: res.map((assetData: UserWalletData) => {
            return {
                asset: convertAddressToSymbol(assetData.asset, network),
                amount: bigNumberToUSD(assetData.amount, PRICING_DECIMALS[network]),
                amountNative: assetData.amountNative,
                currentPrice: assetData.currentPrice,
            };
        }),
    };
}

// Master
export function useUserData(userAddress: any): IUserDataProps {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;

    const queryUserActivity = useQuery({
        queryKey: ['user-activity', network],
        queryFn: () => getUserActivityData(userAddress),
        enabled: !!userAddress,
    });

    const queryUserWallet = useQuery({
        queryKey: ['user-wallet', network],
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
                (el) => el.asset?.toLowerCase() === asset?.toLowerCase(),
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

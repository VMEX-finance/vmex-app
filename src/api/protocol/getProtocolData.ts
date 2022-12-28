import { useQuery } from '@tanstack/react-query';
import { IProtocolProps } from '../../ui/features';
import { IProtocolDataProps } from './types';
import { AssetBalance, getProtocolData } from '@vmexfinance/sdk';
import {
    bigNumberToUSD,
    flipAndLowerCase,
    MAINNET_ASSET_MAPPINGS,
    SDK_PARAMS,
} from '../../utils/sdk-helpers';

export async function getProtocolOverviewData(): Promise<IProtocolProps> {
    const protocolData = await getProtocolData(SDK_PARAMS);
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    return {
        tvl: bigNumberToUSD(protocolData.tvl, 18),
        reserve: bigNumberToUSD(protocolData.totalReserves, 18),
        lenders: protocolData.numLenders,
        borrowers: protocolData.numBorrowers,
        markets: protocolData.numTranches,
        totalSupplied: bigNumberToUSD(protocolData.totalSupplied, 18),
        totalBorrowed: bigNumberToUSD(protocolData.totalBorrowed, 18),
        topBorrowedAssets: protocolData.topBorrowedAssets
            .map((assetBalance: AssetBalance) => {
                const assetName = reverseMapping.get(assetBalance.asset.toString().toLowerCase());
                if (assetName) {
                    assetBalance.asset = assetName;
                }
                return {
                    asset: assetBalance.asset,
                    amount: bigNumberToUSD(assetBalance.amount, 18),
                };
            })
            .slice(0, Math.min(protocolData.topBorrowedAssets.length, 5)),
        topSuppliedAssets: protocolData.topSuppliedAssets
            .map((assetBalance: AssetBalance) => {
                const assetName = reverseMapping.get(assetBalance.asset.toString().toLowerCase());
                if (assetName) {
                    assetBalance.asset = assetName;
                }
                return {
                    asset: assetBalance.asset,
                    amount: bigNumberToUSD(assetBalance.amount, 18),
                };
            })
            .slice(0, Math.min(protocolData.topBorrowedAssets.length, 5)),
        topTranches: protocolData.topTranches.map((tranche: any) => {
            return {
                name: tranche.asset,
                totalBorrowed: tranche.totalBorrowed.toString(),
                totalSupplied: tranche.totalSupplied.toString(),
            };
        }),
    };
}

export function useProtocolData(): IProtocolDataProps {
    const queryProtocolOverview = useQuery({
        queryKey: ['protocol-overview'],
        queryFn: getProtocolOverviewData,
    });

    return {
        queryProtocolOverview,
    };
}

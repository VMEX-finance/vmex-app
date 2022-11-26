import { useQuery } from '@tanstack/react-query';
import { IProtocolProps } from '../../ui/features';
import { MOCK_LINE_DATA_2, MOCK_TOP_ASSETS, MOCK_TOP_TRANCHES } from '../../utils/mock-data';
import { IProtocolDataProps } from './types';
import { AssetBalance, getProtocolData } from '@vmex/sdk';
import { ethers } from 'ethers';
import { flipAndLowerCase, MAINNET_ASSET_MAPPINGS, SDK_PARAMS } from '../../utils/sdk-helpers';

export async function getProtocolOverviewData(): Promise<IProtocolProps> {
    const protocolData = await getProtocolData(SDK_PARAMS);
    const reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

    console.log(protocolData.topSuppliedAssets);

    return {
        tvl: protocolData.tvl,
        reserve: protocolData.totalReserves,
        lenders: protocolData.numLenders,
        borrowers: protocolData.numBorrowers,
        markets: protocolData.numTranches,
        totalSupplied: protocolData.totalSupplied,
        totalBorrowed: protocolData.totalBorrowed,
        topBorrowedAssets: protocolData.topBorrowedAssets
            .map((assetBalance: AssetBalance) => {
                const assetName = reverseMapping.get(assetBalance.asset.toString().toLowerCase());
                if (assetName) {
                    assetBalance.asset = assetName;
                }
                return assetBalance;
            })
            .slice(0, Math.min(protocolData.topBorrowedAssets.length, 5)),
        topSuppliedAssets: protocolData.topSuppliedAssets
            .map((assetBalance: AssetBalance) => {
                const assetName = reverseMapping.get(assetBalance.asset.toString().toLowerCase());
                if (assetName) {
                    assetBalance.asset = assetName;
                }
                return assetBalance;
            })
            .slice(0, Math.min(protocolData.topBorrowedAssets.length, 5)),
        topTranches: protocolData.topTranches,
        graphData: MOCK_LINE_DATA_2,
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

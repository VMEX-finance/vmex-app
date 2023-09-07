import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ISubgraphTranchesDataProps } from './types';
import { ITrancheProps } from '../types';
import { getAllAssetPrices } from '../prices';
import {
    nativeAmountToUSD,
    getApolloClient,
    getTrancheCategory,
    DEFAULT_NETWORK,
    PRICING_DECIMALS,
} from '@/utils';
import { getTrancheIdFromTrancheEntity } from './id-generation';
import { getNetwork } from '@wagmi/core';

export const getSubgraphTranchesOverviewData = async (): Promise<ITrancheProps[]> => {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;
    const { data, error } = await getApolloClient().query({
        query: gql`
            query queryAllTranches {
                tranches(orderBy: id) {
                    id
                    name
                    paused
                    isVerified
                    reserves(where: { symbol_not: "" }) {
                        assetData {
                            underlyingAssetName
                        }
                        totalDeposits
                        availableLiquidity
                        totalCurrentVariableDebt
                        decimals
                    }
                    trancheAdmin {
                        id
                    }
                }
                protocol(id: "1") {
                    globalAdmin
                }
            }
        `,
    });

    if (error) return [];
    else {
        const { tranches, protocols } = data;
        const prices = await getAllAssetPrices();

        let finalObj: Map<
            string,
            {
                tvl: number;
                supplyTotal: number;
                borrowTotal: number;
            }
        > = new Map();
        tranches.map((tranche: any) => {
            const assets = tranche.reserves;
            let trancheData: {
                tvl: number;
                supplyTotal: number;
                borrowTotal: number;
            } = {
                tvl: 0,
                supplyTotal: 0,
                borrowTotal: 0,
            };

            assets.map((item: any) => {
                const assetName = item.assetData.underlyingAssetName.toUpperCase();
                if (!(prices as any)[assetName]) {
                    return;
                }
                const assetUSDPrice = (prices as any)[assetName].usdPrice;
                trancheData = {
                    tvl:
                        trancheData.tvl +
                        nativeAmountToUSD(
                            item.availableLiquidity,
                            PRICING_DECIMALS[network],
                            item.decimals,
                            assetUSDPrice,
                        ),
                    supplyTotal:
                        trancheData.supplyTotal +
                        nativeAmountToUSD(
                            item.totalDeposits,
                            PRICING_DECIMALS[network],
                            item.decimals,
                            assetUSDPrice,
                        ),
                    borrowTotal:
                        trancheData.borrowTotal +
                        nativeAmountToUSD(
                            item.totalCurrentVariableDebt,
                            PRICING_DECIMALS[network],
                            item.decimals,
                            assetUSDPrice,
                        ),
                };
            });

            finalObj.set(tranche.id, trancheData);
        });

        const returnObj: ITrancheProps[] = [];

        tranches.map((tranche: any) => {
            let trancheInfo = {
                id: getTrancheIdFromTrancheEntity(tranche.id),
                name: tranche.name,
                assets: tranche.reserves.map((el: any) => el.assetData.underlyingAssetName),
                tvl: 0,
                supplyTotal: 0,
                borrowTotal: 0,
                category: getTrancheCategory(tranche, data.protocol.globalAdmin),
            };

            const trancheTotals = finalObj.get(tranche.id);

            if (trancheTotals !== undefined) {
                trancheInfo.tvl = trancheTotals.tvl;
                trancheInfo.supplyTotal = trancheTotals.supplyTotal;
                trancheInfo.borrowTotal = trancheTotals.borrowTotal;
            }

            returnObj.push(trancheInfo);
        });
        //subgraph actually stores the ids as int so when querying it, it sorts via string method. This ensures that our array is indeed sorted based on number
        //can deprecate later when subgraph stores them as ints
        returnObj.sort((a, b) => {
            if (!a.id || !b.id) {
                return 0;
            }
            if (Number(a.id) < Number(b.id)) return -1;
            else return 1;
        });
        return returnObj;
    }
};

export function useSubgraphTranchesOverviewData(): ISubgraphTranchesDataProps {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.name?.toLowerCase() || DEFAULT_NETWORK;

    const queryAllTranches = useQuery({
        queryKey: ['tranches-overview-data', network],
        queryFn: () => getSubgraphTranchesOverviewData(),
    });

    return {
        queryAllTranches,
    };
}

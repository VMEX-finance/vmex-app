import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ISubgraphTranchesDataProps, ITrancheCategories } from './types';
import { ITrancheProps } from '../types';
import { getAllAssetPrices } from '../prices';
import { nativeAmountToUSD, apolloClient, getTrancheCategory } from '../../utils';
import { getTrancheIdFromTrancheEntity } from './id-generation';

export const getSubgraphTranchesOverviewData = async (): Promise<ITrancheProps[]> => {
    const { data, error } = await apolloClient.query({
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
            }
        `,
    });

    if (error) return [];
    else {
        const { tranches } = data;
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
                        nativeAmountToUSD(item.availableLiquidity, item.decimals, assetUSDPrice),
                    supplyTotal:
                        trancheData.supplyTotal +
                        nativeAmountToUSD(item.totalDeposits, item.decimals, assetUSDPrice),
                    borrowTotal:
                        trancheData.borrowTotal +
                        nativeAmountToUSD(
                            item.totalCurrentVariableDebt,
                            item.decimals,
                            assetUSDPrice,
                        ),
                };
            });

            finalObj.set(tranche.id, trancheData);
        });

        const returnObj: ITrancheProps[] = [];
        const globalAdmin = ''; // TODO: Find the global admin

        tranches.map((tranche: any) => {
            let trancheInfo = {
                id: getTrancheIdFromTrancheEntity(tranche.id),
                name: tranche.name,
                assets: tranche.reserves.map((el: any) => el.assetData.underlyingAssetName),
                tvl: 0,
                supplyTotal: 0,
                borrowTotal: 0,
                category: getTrancheCategory(tranche),
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
    const queryAllTranches = useQuery({
        queryKey: ['tranches-overview-data'],
        queryFn: () => getSubgraphTranchesOverviewData(),
    });

    return {
        queryAllTranches,
    };
}

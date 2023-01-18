import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ISubgraphTranchesDataProps } from './types';
import { ITrancheProps } from '../types';
import { getAllAssetPrices } from '../prices';
import { nativeAmountToUSD, apolloClient } from '../../utils';

export const getSubgraphTranchesOverviewData = async (): Promise<ITrancheProps[]> => {
    const { data, error } = await apolloClient.query({
        query: gql`
            query queryAllTranches {
                tranches(orderBy: id) {
                    id
                    name
                    paused
                    reserves {
                        assetData {
                            underlyingAssetName
                        }
                        totalDeposits
                        availableLiquidity
                        totalCurrentVariableDebt
                        decimals
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
            finalObj.set(
                tranche.id,
                assets.reduce(
                    (obj: any, item: any) => {
                        const assetUSDPrice = (prices as any)[item.assetData.underlyingAssetName]
                            .usdPrice;
                        return Object.assign(obj, {
                            tvl:
                                obj.tvl +
                                nativeAmountToUSD(
                                    item.availableLiquidity,
                                    item.decimals,
                                    assetUSDPrice,
                                ),
                            supplyTotal:
                                obj.supplyTotal +
                                nativeAmountToUSD(item.totalDeposits, item.decimals, assetUSDPrice),
                            borrowTotal:
                                obj.borrowTotal +
                                nativeAmountToUSD(
                                    item.totalCurrentVariableDebt,
                                    item.decimals,
                                    assetUSDPrice,
                                ),
                        });
                    },
                    {
                        tvl: 0,
                        supplyTotal: 0,
                        borrowTotal: 0,
                    },
                ),
            );
        });

        const returnObj: ITrancheProps[] = [];

        tranches.map((tranche: any) => {
            let trancheInfo = {
                id: tranche.id,
                name: tranche.name,
                assets: tranche.reserves.map((el: any) => el.assetData.underlyingAssetName),
                tvl: 0,
                supplyTotal: 0,
                borrowTotal: 0,
            };

            const trancheTotals = finalObj.get(tranche.id);

            if (trancheTotals !== undefined) {
                trancheInfo.tvl = trancheTotals.tvl;
                trancheInfo.supplyTotal = trancheTotals.supplyTotal;
                trancheInfo.borrowTotal = trancheTotals.borrowTotal;
            }

            returnObj.push(trancheInfo);
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

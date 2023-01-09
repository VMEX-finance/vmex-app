import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { ISubgraphTranchesDataProps } from './types';
import { ITrancheProps } from '../types';
import { getAllAssetPrices, usePricesData } from '../prices';
import { nativeAmountToUSD } from '../../utils/sdk-helpers';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

export const getSubgraphTranchesOverviewData = async (): Promise<ITrancheProps[]> => {
    const { data, error } = await client.query({
        // TODO: Handle pagination, for now it returns the first 10 tranches
        query: gql`
            query queryAllTranches {
                tranches(first: 10) {
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

        console.log('getSubgraphTranchesOverviewData:', returnObj);
        return returnObj;
    }
};

export function useSubgraphTranchesOverviewData(): ISubgraphTranchesDataProps {
    const queryAllTranches = useQuery({
        queryKey: ['subgraph-tranches-overview-data'],
        queryFn: () => getSubgraphTranchesOverviewData(),
    });

    return {
        queryAllTranches,
    };
}

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { ISubgraphTrancheData, ISubgraphTranchesDataProps } from './types';
import { ITrancheProps } from '../types';
import { utils } from 'ethers';

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
                        symbol
                        totalDeposits
                        totalLiquidity
                        totalCurrentVariableDebt
                    }
                }
            }
        `,
    });

    if (error) return [];
    else {
        const tranches = data.tranches;

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
                    (obj: any, item: any) =>
                        Object.assign(obj, {
                            tvl: obj.tvl + item.totalLiquidity,
                            supplyTotal: obj.supplyTotal + item.totalDeposits,
                            borrowTotal: obj.borrowTotal + item.totalCurrentVariableDebt,
                        }),
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
                assets: tranche.reserves.map((el: any) => el.symbol.slice(0, -1)),
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

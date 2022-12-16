import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { IGraphTrancheDataProps, ISubgraphTrancheData } from './types';
import { utils } from 'ethers';

const client = new ApolloClient({
    uri: SUBGRAPH_ENDPOINT,
    cache: new InMemoryCache(),
});

export const getSubgraphTrancheData = async (
    _trancheId: string | number,
): Promise<IGraphTrancheDataProps> => {
    if (!_trancheId) return {};

    const trancheId = String(_trancheId);
    const { data, error } = await client.query({
        query: gql`
            query QueryTranche($trancheId: String!) {
                tranche(id: $trancheId) {
                    reserves {
                        symbol
                        baseLTVasCollateral
                        utilizationRate
                        reserveFactor
                        optimalUtilisationRate
                        decimals
                        variableBorrowRate
                        liquidityRate
                        reserveLiquidationThreshold
                        totalDeposits
                        availableLiquidity
                        usageAsCollateralEnabled
                    }
                }
            }
        `,
        variables: { trancheId },
    });

    if (error) return {};
    else {
        const assets = data.tranche.reserves;
        const finalObj = assets.reduce(
            (obj: any, item: any) =>
                Object.assign(obj, {
                    [item.symbol.slice(0, -1)]: {
                        liquidity: utils.formatUnits(item.availableLiquidity, item.decimals),
                        ltv: item.baseLTVasCollateral,
                        liquidityRate: `${utils.formatUnits(item.liquidityRate, 27)}%`,
                        optimalUtilityRate: parseFloat(
                            utils.formatUnits(item.optimalUtilisationRate, 27),
                        ), // Not 100% why it's 27 decimals
                        reserveFactor: item.reserveFactor,
                        liquidationThreshold: item.reserveLiquidationThreshold,
                        totalBorrowed: utils.formatUnits(
                            String(
                                Math.abs(
                                    Number(item.availableLiquidity) - Number(item.totalDeposits),
                                ),
                            ),
                            item.decimals,
                        ),
                        utilityRate: `${item.utilizationRate}`,
                        borrowRate: utils.formatUnits(item.variableBorrowRate, 27),
                        supplyRate: '0', // TODO
                        liquidationPenalty: '0', // TODO
                        collateral: true, // TODO
                        oracle: 'Chainlink', // TODO
                        totalSupplied: utils.formatUnits(item.totalDeposits, item.decimals),
                    },
                }),
            {},
        );

        const returnObj = {
            assetsData: finalObj,
            utilityRate: '0',
            assets: data.tranche.reserves.map((el: any) => el.symbol.slice(0, -1)),
            adminFee: 0.02,
            platformFee: 0.03,
        };

        console.log('getSubgraphTrancheData:', returnObj);
        return returnObj;
    }
};

export function useSubgraphTrancheData(trancheId: string | number): ISubgraphTrancheData {
    const queryTrancheData = useQuery({
        queryKey: ['subgraph-tranche-data'],
        queryFn: () => getSubgraphTrancheData(trancheId),
    });

    return {
        queryTrancheData,
    };
}

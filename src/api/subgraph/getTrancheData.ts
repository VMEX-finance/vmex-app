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
                    name
                    emergencyTrancheAdmin
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
                        reserveLiquidationBonus
                        totalDeposits
                        availableLiquidity
                        totalCurrentVariableDebt
                        usageAsCollateralEnabled
                        borrowingEnabled
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
                        optimalUtilityRate: parseFloat(
                            utils.formatUnits(item.optimalUtilisationRate, 27),
                        ),
                        reserveFactor: item.reserveFactor,
                        liquidationThreshold: item.reserveLiquidationThreshold,
                        utilityRate: `${item.utilizationRate}`,
                        borrowRate: utils.formatUnits(item.variableBorrowRate, 27),
                        supplyRate: utils.formatUnits(item.liquidityRate, 27),
                        liquidationPenalty: utils.formatUnits(item.reserveLiquidationBonus, 5),
                        collateral: item.usageAsCollateralEnabled,
                        canBeBorrowed: item.borrowingEnabled,
                        oracle: 'Chainlink', // TODO
                        totalSupplied: utils.formatUnits(item.totalDeposits, item.decimals),
                        totalBorrowed: utils.formatUnits(
                            item.totalCurrentVariableDebt,
                            item.decimals,
                        ),
                    },
                }),
            {},
        );

        const summaryData = assets.reduce(
            (obj: any, item: any) =>
                Object.assign(obj, {
                    tvl: obj.tvl + item.availableLiquidity,
                    supplyTotal: obj.supplyTotal + item.totalDeposits,
                    borrowTotal: obj.borrowTotal + item.totalCurrentVariableDebt,
                }),
            {
                tvl: 0,
                supplyTotal: 0,
                borrowTotal: 0,
            },
        );

        const returnObj = {
            assetsData: finalObj,
            utilityRate: '0',
            assets: data.tranche.reserves.map((el: any) => el.symbol.slice(0, -1)),
            adminFee: 0.02, // TODO
            platformFee: 0.03, // TODO
            id: trancheId,
            name: data.tranche.name,
            admin: data.tranche.emergencyTrancheAdmin,
            availableLiquidity: summaryData.tvl,
            totalSupplied: summaryData.supplyTotal,
            totalBorrowed: summaryData.borrowTotal,
            tvl: summaryData.tvl,
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

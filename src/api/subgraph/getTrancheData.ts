import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_ENDPOINT } from '../../utils/constants';
import { IGraphTrancheDataProps, ISubgraphTrancheData } from './types';
import { utils } from 'ethers';
import { getAllAssetPrices } from '../prices';
import { nativeAmountToUSD } from '../../utils/sdk-helpers';
import { usdFormatter, percentFormatter } from '../../utils/helpers';

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
                        assetData {
                            underlyingAssetName
                        }
                        # baseLTVasCollateral
                        utilizationRate
                        reserveFactor
                        optimalUtilisationRate
                        decimals
                        variableBorrowRate
                        liquidityRate
                        # reserveLiquidationThreshold
                        # reserveLiquidationBonus
                        totalDeposits
                        availableLiquidity
                        totalCurrentVariableDebt
                        usageAsCollateralEnabled
                        borrowingEnabled
                        assetData {
                            underlyingAssetName
                            baseLTV
                            liquidationThreshold
                            liquidationBonus
                        }
                    }
                }
            }
        `,
        variables: { trancheId },
    });

    if (error) return {};
    else {
        const assets = data.tranche.reserves;
        const prices = await getAllAssetPrices();
        const finalObj = assets.reduce(
            (obj: any, item: any) =>
                Object.assign(obj, {
                    [item.assetData.underlyingAssetName]: {
                        liquidity: utils.formatUnits(item.availableLiquidity, item.decimals),
                        ltv: item.assetData.baseLTV,
                        optimalUtilityRate: parseFloat(
                            utils.formatUnits(item.optimalUtilisationRate, 27),
                        ),
                        reserveFactor: item.reserveFactor,
                        liquidationThreshold: item.assetData.liquidationThreshold,
                        utilityRate: `${item.utilizationRate}`,
                        borrowRate: utils.formatUnits(item.variableBorrowRate, 27),
                        supplyRate: utils.formatUnits(item.liquidityRate, 27),
                        liquidationPenalty: utils.formatUnits(item.assetData.liquidationBonus, 5),
                        collateral: item.usageAsCollateralEnabled,
                        canBeBorrowed: item.borrowingEnabled,
                        oracle: 'Chainlink', // TODO: map to human readable name // (prices as any)[item.assetData.underlyingAssetName].oracle
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
            (obj: any, item: any) => {
                const asset = item.assetData.underlyingAssetName;
                const assetUSDPrice = (prices as any)[asset].usdPrice;

                return Object.assign(obj, {
                    tvl:
                        obj.tvl +
                        nativeAmountToUSD(item.availableLiquidity, item.decimals, assetUSDPrice),
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
        );

        const returnObj = {
            assetsData: finalObj,
            utilityRate: '0',
            assets: data.tranche.reserves.map((el: any) => el.assetData.underlyingAssetName),
            adminFee: 0.02, // TODO
            platformFee: 0.03, // TODO
            id: trancheId,
            name: data.tranche.name,
            admin: data.tranche.emergencyTrancheAdmin,
            availableLiquidity: usdFormatter().format(summaryData.tvl),
            totalSupplied: usdFormatter().format(summaryData.supplyTotal),
            totalBorrowed: usdFormatter().format(summaryData.borrowTotal),
            tvl: usdFormatter().format(summaryData.tvl),
            poolUtilization: percentFormatter.format(
                1 - (summaryData.supplyTotal - summaryData.borrowTotal) / summaryData.supplyTotal,
            ),
        };

        console.log('getSubgraphTrancheData:', returnObj);
        return returnObj;
    }
};

export function useSubgraphTrancheData(trancheId: string | number): ISubgraphTrancheData {
    const queryTrancheData = useQuery({
        queryKey: ['subgraph-tranche-data'],
        queryFn: () => getSubgraphTrancheData(trancheId),
        enabled: !!trancheId,
    });

    return {
        queryTrancheData,
    };
}

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

export const processTrancheData = async (
    data: any,
    trancheId?: string,
): Promise<IGraphTrancheDataProps> => {
    const assets = data.reserves;
    const prices = await getAllAssetPrices();
    const finalObj = assets.reduce(
        (obj: any, item: any) =>
            Object.assign(obj, {
                [item.assetData.underlyingAssetName]: {
                    liquidity: item.availableLiquidity,
                    decimals: item.decimals,
                    ltv: item.assetData.baseLTV,
                    optimalUtilityRate: percentFormatter.format(
                        parseFloat(utils.formatUnits(item.optimalUtilisationRate, 27)),
                    ),
                    reserveFactor: item.reserveFactor,
                    vmexReserveFactor: item.assetData.vmexReserveFactor,
                    liquidationThreshold: item.assetData.liquidationThreshold,
                    utilityRate: `${item.utilizationRate}`,
                    borrowRate: percentFormatter.format(
                        Number(utils.formatUnits(item.variableBorrowRate, 27)),
                    ),
                    supplyRate: percentFormatter.format(
                        Number(utils.formatUnits(item.liquidityRate, 27)),
                    ),
                    collateral: item.usageAsCollateralEnabled,
                    canBeBorrowed: item.borrowingEnabled,
                    oracle: 'Chainlink', // TODO: map to human readable name // (prices as any)[item.assetData.underlyingAssetName].oracle
                    totalSupplied: utils.formatUnits(item.totalDeposits, item.decimals),
                    totalBorrowed: utils.formatUnits(item.totalCurrentVariableDebt, item.decimals),
                    baseLTV: item.assetData.baseLTV,
                    liquidationBonus: item.assetData.liquidationBonus,
                    borrowFactor: item.assetData.borrowFactor,
                    borrowCap: item.assetData.borrowCap,
                    supplyCap: item.assetData.supplyCap,
                    priceUSD: (prices as any)[item.assetData.underlyingAssetName].usdPrice,
                    priceETH: (prices as any)[item.assetData.underlyingAssetName].ethPrice,
                    yieldStrategy: item.yieldStrategy,
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
                    nativeAmountToUSD(item.totalCurrentVariableDebt, item.decimals, assetUSDPrice),
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
        assets: assets.map((el: any) => el.assetData.underlyingAssetName),
        id: trancheId ? trancheId : data.id,
        name: data.name,
        admin: data.trancheAdmin,
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
};

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
                    trancheAdmin
                    reserves {
                        utilizationRate
                        reserveFactor
                        optimalUtilisationRate
                        decimals
                        variableBorrowRate
                        liquidityRate
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
                            borrowFactor
                            borrowCap
                            supplyCap
                            vmexReserveFactor
                        }
                        yieldStrategy
                    }
                }
            }
        `,
        variables: { trancheId },
    });

    if (error) return {};
    else {
        const dat = data.tranche;
        return processTrancheData(dat, trancheId);
    }
};

export function useSubgraphTrancheData(trancheId: string | number): ISubgraphTrancheData {
    console.log('useSUBGRAPH', trancheId);
    const queryTrancheData = useQuery({
        queryKey: ['subgraph-tranche-data', trancheId],
        queryFn: () => getSubgraphTrancheData(trancheId),
        enabled: !!trancheId,
    });

    const findAssetInMarketsData = (asset: string) => {
        if (queryTrancheData.isLoading) return undefined;
        else {
            return (queryTrancheData.data?.assetsData as any)[asset];
        }
    };

    return {
        queryTrancheData,
        findAssetInMarketsData,
    };
}

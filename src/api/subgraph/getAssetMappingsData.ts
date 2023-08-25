import { gql } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { ISubgraphAllAssetMappingsData } from './types';
import { IAssetMappings } from '../types';
import { getApolloClient } from '../../utils';
import { getAllAssetPrices } from '../prices';

export const getSubgraphAllAssetMappingsData = async (): Promise<Map<string, IAssetMappings>> => {
    const { data, error } = await getApolloClient().query({
        query: gql`
            query QueryAllAssetMappings {
                assetDatas {
                    underlyingAssetName
                    underlyingAssetDecimals
                    borrowingEnabled
                    baseLTV
                    borrowCap
                    borrowFactor
                    interestRateStrategyAddress
                    liquidationBonus
                    liquidationThreshold
                    supplyCap
                    vmexReserveFactor
                }
            }
        `,
    });

    if (error) return new Map<string, IAssetMappings>();
    else {
        const returnObj: Map<string, IAssetMappings> = new Map<string, IAssetMappings>();
        data.assetDatas.map((el: any) => {
            returnObj.set(el.underlyingAssetName.toUpperCase(), {
                asset: el.underlyingAssetName,
                decimals: el.underlyingAssetDecimals,
                borrowFactor: el.borrowFactor,
                borrowCap: el.borrowCap,
                baseLTV: el.baseLTV.toString(),
                supplyCap: el.supplyApy,
                vmexReserveFactor: el.vmexReserveFactor,
                interestRateStrategyAddress: el.interestRateStrategyAddress,
                liquidationBonus: el.liquidationBonus,
                liqudiationThreshold: el.liqudiationThreshold,
                canBeBorrowed: el.borrowingEnabled,
            });
        });

        return returnObj;
    }
};

export function useSubgraphAllAssetMappingsData(): ISubgraphAllAssetMappingsData {
    const queryAllAssetMappingsData = useQuery({
        queryKey: [`subgraph-all-asset-mappings-data`],
        queryFn: () => getSubgraphAllAssetMappingsData(),
    });

    const queryAssetPrices = useQuery({
        queryKey: ['all-asset-prices'],
        queryFn: () => getAllAssetPrices(),
    });

    const findAssetInMappings = (asset: string) => {
        if (queryAllAssetMappingsData.isLoading) return undefined;
        else {
            return queryAllAssetMappingsData.data?.get(asset.toUpperCase());
        }
    };

    return {
        queryAllAssetMappingsData,
        queryAssetPrices,
        findAssetInMappings,
    };
}

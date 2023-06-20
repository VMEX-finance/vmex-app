import { gql } from '@apollo/client';
import { apolloClient } from '../../utils';
import { VmexRewardsData } from '../types';
import { getTrancheIdFromTrancheEntity } from './id-generation';

export const getSubgraphRewardData = async (): Promise<VmexRewardsData[]> => {
    const { data, error } = await apolloClient.query({
        query: gql`
            query QueryReservesAndTranches {
                vmexRewards {
                    emissionsEndTimestamp
                    emissionsPerSecond
                    id
                    index
                    rewardToken
                    rewardTokenDecimals
                    rewardTokenSymbol
                    updatedAt
                    incentivizedReserve {
                        id
                        tranche {
                            id
                        }
                        underlyingAssetAddress
                    }
                }
            }
        `,
    });
    if (error) return [];

    const returnObj: VmexRewardsData[] = [];

    // const currentUnixTime = Date.now()/1000;

    data.vmexRewards.forEach((el: any) => {
        // if (el.emissionsEndTimestamp > currentUnixTime) {
        // only add the incentive if its still being streamed
        returnObj.push({
            emissionsEndTimestamp: el.emissionsEndTimestamp,
            emissionsPerSecond: el.emissionsPerSecond,
            index: el.index,
            rewardToken: el.rewardToken,
            rewardTokenDecimals: el.rewardTokenDecimals,
            rewardTokenSymbol: el.rewardTokenSymbol,
            trancheId: getTrancheIdFromTrancheEntity(el.incentivizedReserve.tranche.id),
            aTokenAddress: el.incentivizedReserve.id,
            underlyingAssetAddress: el.incentivizedReserve.underlyingAssetAddress,
        });
        // }
    });

    return returnObj;
};

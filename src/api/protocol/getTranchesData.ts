import { useQuery } from '@tanstack/react-query';
import { ITranchesDataProps } from './types';
import { getAllTrancheData } from '@vmexfinance/sdk';
import {
    bigNumberToUSD,
    SDK_PARAMS,
    REVERSE_MAINNET_ASSET_MAPPINGS,
} from '../../utils/sdk-helpers';
import { ITrancheProps } from '../types';

export async function getAllTranches(): Promise<ITrancheProps[]> {
    const trancheData = await getAllTrancheData(SDK_PARAMS);

    let slightlyMocked: ITrancheProps[] = [];

    for (let i = 0; i < trancheData.length; i++) {
        let newAssets: string[] = [];

        for (let j = 0; j < trancheData[i].assets.length; j++) {
            let myasset = trancheData[i].assets[j].toString().toLowerCase();
            let myAssetSym = REVERSE_MAINNET_ASSET_MAPPINGS.get(myasset);
            if (typeof myAssetSym === 'string') {
                newAssets.push(myAssetSym);
            } else {
                console.log(
                    `Error: Token address, ${myAssetSym || ''}, not found in ${
                        trancheData[i].name
                    }`,
                );
            }
        }

        slightlyMocked.push({
            id: trancheData[i].id.toString(),
            name: trancheData[i].name,
            assets: newAssets,
            aggregateRating: trancheData[i].grade.toString(), //offchain oracle
            yourActivity: 'none', //FE tracking
            tvl: bigNumberToUSD(trancheData[i].tvl, 18),
            tvlChange: 3.86, //offchain contracts analytics
            supplyChange: 1.02,
            borrowChange: -1.95,
            supplyTotal: bigNumberToUSD(trancheData[i].totalSupplied, 18),
            borrowTotal: bigNumberToUSD(trancheData[i].totalBorrowed, 18),
            liquidity: bigNumberToUSD(trancheData[i].availableLiquidity, 18),
            poolUtilization: '0.00',
            upgradeable: 'Yes',
            admin: trancheData[i].admin.toString(),
            platformFee: 10,
            adminFee: '1.00',
            oracle: 'Chainlink',
            whitelist: 'No',
            ltv: 0,
            liquidThreshold: 0,
            liquidPenalty: 0,
            collateral: 'Yes',
            statisticsSupplied: 1.85,
            utilization: trancheData[i].utilization.toString(),
            statisticsBorrowed: 1.43,
            reserveFactor: 0.21,
            strategy: '11.12',
        });
        if (trancheData[i].whitelist) {
            slightlyMocked[i].whitelist = 'Yes';
        }
    }

    return slightlyMocked;
}

export function useTranchesData(): ITranchesDataProps {
    const queryAllTranches = useQuery({
        queryKey: ['all-tranches'],
        queryFn: getAllTranches,
    });

    return {
        queryAllTranches,
    };
}

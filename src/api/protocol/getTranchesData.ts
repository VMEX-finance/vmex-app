import { ITrancheProps } from '@models/tranches';
import { useQuery } from '@tanstack/react-query';
import { MOCK_TRANCHES_DATA } from '../../utils/mock-data';
import { ITranchesDataProps } from './types';
import { getAllTrancheData } from '@vmex/sdk';
import { SDK_PARAMS, MAINNET_ASSET_MAPPINGS, flipAndLowerCase } from '../../utils/sdk-helpers';
import { bigNumberToUSD } from '../../utils/helpers';

export async function getAllTranches(): Promise<ITrancheProps[]> {
    const trancheData = await getAllTrancheData(SDK_PARAMS);

    let slightlyMocked: ITrancheProps[] = [];
    let reverseMapping = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);
    // console.log(reverseMapping)

    for (let i = 0; i < trancheData.length; i++) {
        slightlyMocked.push(MOCK_TRANCHES_DATA[i]);
        slightlyMocked[i].id = trancheData[i].id.toString();
        slightlyMocked[i].name = trancheData[i].name;
        let newAssets: string[] = [];

        for (let j = 0; j < trancheData[i].assets.length; j++) {
            let myasset = trancheData[i].assets[j].toString().toLowerCase();
            // console.log(myasset)
            let myAssetSym = reverseMapping.get(myasset);
            if (typeof myAssetSym === 'string') {
                newAssets.push(myAssetSym);
            } else {
                console.log('ERROR: ADDRESS NOT FOUND IN DICT');
            }
        }
        slightlyMocked[i].assets = newAssets;
        // TODO: convert bignumber to usd, in analytics use oracles
        slightlyMocked[i].tvl = bigNumberToUSD(trancheData[i].tvl, 18);
        slightlyMocked[i].supplyTotal = bigNumberToUSD(trancheData[i].totalSupplied, 18);
        slightlyMocked[i].borrowTotal = bigNumberToUSD(trancheData[i].totalBorrowed, 18);

        slightlyMocked[i].liquidity = bigNumberToUSD(trancheData[i].availableLiquidity, 18);
        if (trancheData[i].upgradeable) {
            slightlyMocked[i].upgradeable = 'Yes';
        } else {
            slightlyMocked[i].upgradeable = 'No';
        }

        slightlyMocked[i].utilization = trancheData[i].utilization.toString();
        slightlyMocked[i].admin = trancheData[i].admin.toString();
        if (trancheData[i].whitelist) {
            slightlyMocked[i].whitelist = 'Yes';
        } else {
            slightlyMocked[i].whitelist = 'No';
        }
        slightlyMocked[i].aggregateRating = trancheData[i].grade.toString();
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

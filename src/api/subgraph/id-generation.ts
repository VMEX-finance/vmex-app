import { getContractAddress } from '@vmexfinance/sdk';
import { NETWORK } from '../../utils';

export const getPoolId = (): string => {
    return `${getContractAddress('LendingPoolAddressesProvider', NETWORK).toLowerCase()}`;
};

export const getReserveId = (underlyingAsset: string, trancheId: string): string => {
    return `${getPoolId()}:${underlyingAsset}:${trancheId}`;
};

export const getTrancheId = (trancheId: string): string => {
    return `${getPoolId()}:${trancheId}`;
};

export function getTrancheIdFromTrancheEntity(id: string): string {
    return id.split(':')[1];
}

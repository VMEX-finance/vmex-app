import { getContractAddress } from '@vmexfinance/sdk';
import { getNetworkName } from '@/utils';

export const getPoolId = (): string => {
    const network = getNetworkName();
    return `${getContractAddress('LendingPoolAddressesProvider', network)?.toLowerCase()}`;
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

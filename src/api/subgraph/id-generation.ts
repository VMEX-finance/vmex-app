import { getContractAddress } from '@vmexfinance/sdk';
import { getNetwork } from '@wagmi/core';
import { DEFAULT_NETWORK } from '@/utils';

export const getPoolId = (): string => {
    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
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

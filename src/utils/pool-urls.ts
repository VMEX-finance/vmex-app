import { NETWORKS, getNetworkName } from './network';

export const redirectToPool = (address: string) => {
    const network = getNetworkName();
    const strategies = NETWORKS[network]?.strategies;
    if (!strategies) return;
    if (!strategies[address?.toLowerCase()]) return;
    const { name, token0, token1 } = strategies[address?.toLowerCase()];
    const isStable = Boolean(name.startsWith('s'));

    const baseUrls = 'https://velodrome.finance/deposit';
    return `${baseUrls}?token0=${token0.toLowerCase()}&token1=${token1.toLowerCase()}&stable=${isStable}`;
};

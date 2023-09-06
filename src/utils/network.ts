import { mainnet, optimism, sepolia, hardhat } from 'wagmi/chains';
import { TESTING } from './constants';

export const NETWORKS: Record<string, any> = {
    optimism: {
        name: 'optimism',
        rpc: 'https://mainnet.optimism.io',
        subgraph: 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-optimism',
        chainId: 10,
        explorer: 'https://explorer.optimism.io',
        backend: 'https://seal-app-bomfb.ondigitalocean.app',
        testing: false,
        icon: '/coins/op.svg',
    },
    localhost: {
        name: 'hardhat',
        rpc: 'http://127.0.0.1:8545',
        subgraph: 'http://127.0.0.1:8000/subgraphs/name/vmex-finance',
        chainId: 31337,
        explorer: 'https://etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // replace later
        testing: true,
        icon: '/networks/hardhat.svg',
    },
    sepolia: {
        name: 'sepolia',
        rpc: 'https://eth-sepolia.public.blastapi.io',
        subgraph: 'https://api.studio.thegraph.com/query/40387/vmex-finance-sepolia/version/latest',
        chainId: 11155111,
        explorer: 'https://sepolia.etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // replace later
        testing: true,
        icon: '/networks/sepolia.png',
    },
    mainnet: {
        name: 'mainnet',
        rpc: '', // Fill in
        subgraph: '', // fill in
        chainId: 1,
        explorer: 'https://etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // replace later
        testing: false,
        icon: '/coins/eth.svg',
    },
    // base: {
    //     name: 'Base',
    //     rpc: 'https://mainnet.base.org',
    //     subgraph: '',
    //     chainId: 8453,
    //     explorer: 'https://basescan.org',
    //     backend: 'https://dolphin-app-ajfiy.ondigitalocean.app',
    //     testing: false,
    //     icon: ''
    // }
};

export const DEFAULT_NETWORK = 'optimism';

export const availableNetworks = (type: 'wagmi' | 'string') => {
    if (type === 'wagmi') {
        if (TESTING) return [optimism, sepolia, hardhat];
        return [optimism, sepolia];
    }
    if (TESTING) return ['optimism', 'sepolia', 'hardhat'];
    return ['optimism', 'sepolia'];
};

export const renderNetworks = (fx?: any) => {
    const networks = Object.values(NETWORKS).filter(
        (network) => availableNetworks('string').indexOf(network.name) >= 0,
    );
    return networks.map((network) => ({
        text: network.name,
        onClick: () => (fx ? fx(network.chainId) : {}),
        icon: network.icon,
    }));
};

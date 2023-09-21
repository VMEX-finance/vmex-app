import { mainnet, optimism, sepolia, hardhat, Chain } from 'wagmi/chains';
import { TESTING } from './constants';

export const NETWORKS: Record<string, any> = {
    optimism: {
        name: 'optimism',
        rpc: 'https://optimism.llamarpc.com/rpc/01HAB77HZWAN9HN4HRT2HPT31S', // https://mainnet.optimism.io
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
    base: {
        name: 'base',
        rpc: 'https://base-mainnet.public.blastapi.io',
        subgraph: 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-base',
        chainId: 8453,
        explorer: 'https://basescan.org',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app',
        testing: false,
        icon: '/networks/base.png',
    },
};

const baseChain: Chain | any = {
    id: NETWORKS.base.chainId,
    name: 'Base',
    network: NETWORKS.base.name,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    iconUrl:
        'https://assets-global.website-files.com/5f973c97cf5aea614f93a26c/6451a34baee26f54b2419cf3_base-logo.png',
    iconBackground: '#fff',
    rpcUrls: {
        default: {
            http: ['https://mainnet.base.org'],
        },
        public: {
            http: ['https://mainnet.base.org'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'Basescout',
            url: 'https://base.blockscout.com',
        },
        default: {
            name: 'Basescan',
            url: 'https://basescan.org',
        },
        etherscan: {
            name: 'Basescan',
            url: 'https://basescan.org',
        },
    },
};

export const DEFAULT_NETWORK = 'optimism';

export const availableNetworks = (type: 'wagmi' | 'string') => {
    if (type === 'wagmi') {
        if (TESTING) return [optimism, baseChain, sepolia, hardhat];
        return [optimism, baseChain, sepolia];
    }
    const networks = ['optimism', 'base', 'sepolia'];
    if (TESTING) networks.push('hardhat');
    return networks;
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

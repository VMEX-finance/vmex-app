import { mainnet, optimism, sepolia, hardhat, Chain, arbitrum } from 'wagmi/chains';
import { TESTING } from './constants';
import { getNetwork } from '@wagmi/core';

export const NETWORKS: Record<string, any> = {
    optimism: {
        name: 'optimism',
        rpc: `https://optimism.llamarpc.com/rpc/${process.env.REACT_APP_LLAMA_RPC_KEY}`, // https://mainnet.optimism.io
        subgraph: 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-optimism',
        chainId: 10,
        explorer: 'https://explorer.optimism.io',
        backend: 'https://seal-app-bomfb.ondigitalocean.app',
        testing: false,
        icon: '/coins/op.svg',
        veloRouterAddress: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858',
        lendingPoolAddress: '0x60F015F66F3647168831d31C7048ca95bb4FeaF9',
        leverageControllerAddress: '0x8c2EBB3b1cCAc295D1EC1887e0E729961F026127',
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
        backend: '', // fill in
        testing: false,
        icon: '/coins/eth.svg',
    },
    base: {
        name: 'base',
        rpc: 'https://base-mainnet.public.blastapi.io',
        subgraph: 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-base',
        chainId: 8453,
        explorer: 'https://basescan.org',
        backend: 'https://seal-app-bomfb.ondigitalocean.app',
        testing: false,
        icon: '/networks/base.png',
    },
    arbitrum: {
        name: 'arbitrum',
        rpc: 'https://arbitrum-one.public.blastapi.io',
        subgraph: 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-arbitrum',
        chainId: 42161,
        explorer: 'https://arbiscan.io/',
        backend: 'https://seal-app-bomfb.ondigitalocean.app',
        testing: false,
        icon: '/coins/arb.svg',
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
export const DEFAULT_CHAINID = 10;

export const availableNetworks = (type: 'wagmi' | 'string') => {
    if (type === 'wagmi') {
        if (TESTING) return [optimism, baseChain, arbitrum, sepolia, hardhat];
        return [optimism, baseChain, arbitrum, sepolia];
    }
    const networks = ['optimism', 'base', 'arbitrum', 'sepolia'];
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

export const getNetworkName = () => {
    return getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
};

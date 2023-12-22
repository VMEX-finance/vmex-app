import { mainnet, optimism, goerli, sepolia, hardhat, Chain, arbitrum } from 'wagmi/chains';
import { TESTING } from './constants';
import { getNetwork } from '@wagmi/core';
import { CONTRACTS, STRATEGIES } from './contracts';

export const NETWORKS: Record<string, any> = {
    optimism: {
        name: 'optimism',
        rpc: `https://optimism.llamarpc.com/rpc/${process.env.REACT_APP_LLAMA_RPC_KEY}`, // https://mainnet.optimism.io
        subgraph: 'https://api.thegraph.com/subgraphs/name/fico23/vmex-optimism-test', // 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-optimism',
        chainId: 10,
        explorer: 'https://explorer.optimism.io',
        backend: 'https://seal-app-bomfb.ondigitalocean.app',
        testing: false,
        icon: '/coins/op.svg',
        veloRouterAddress: CONTRACTS[10].veloRouter,
        veloFactoryAddress: CONTRACTS[10].veloFactory,
        lendingPoolAddress: CONTRACTS[10].lendingPool,
        leverageControllerAddress: CONTRACTS[10].leverageController,
        strategies: STRATEGIES[10],
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
    goerli: {
        name: 'goerli',
        rpc: 'https://eth-goerli.public.blastapi.io',
        subgraph: 'https://api.studio.thegraph.com/query/40387/vmex-finance-sepolia/version/latest', // sepolia
        chainId: 5,
        explorer: 'https://goerli.etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // sepolia
        testing: true,
        icon: '/networks/goerli.png',
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
export const VMEX_VEVMEX_CHAINID = process.env.REACT_APP_TEST ? 5 : DEFAULT_CHAINID;

export const availableNetworks = (type: 'wagmi' | 'string') => {
    if (type === 'wagmi') {
        if (TESTING) return [optimism, baseChain, arbitrum, sepolia, goerli, hardhat];
        return [optimism, baseChain, arbitrum, sepolia];
    }
    const networks = ['optimism', 'base', 'arbitrum', 'sepolia'];
    if (TESTING) {
        networks.push('hardhat');
        networks.push('goerli');
    }
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

export const isChainUnsupported = () => {
    if (getNetwork()?.chain?.unsupported || getNetwork()?.chain?.id === 1) return true;
    return false;
};

export const getNetworkName = () => {
    return isChainUnsupported() || getNetwork()?.chain?.id === 5
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;
};

export const getChainId = () => {
    return isChainUnsupported() ? DEFAULT_CHAINID : getNetwork()?.chain?.id || DEFAULT_CHAINID;
};

const HARDCODED_TRANCHE_NAMES: Record<string, string> = {
    '�N|�%��.��U$��D9Iyś��M���u�': 'LP asset tranche',
    '�V@�nг,� [��͔�pD}����v�9�p': 'Base assets tranche',
};

export const hardcodedTrancheNames = (name: string): string => {
    if (name in HARDCODED_TRANCHE_NAMES) {
        return HARDCODED_TRANCHE_NAMES[name];
    }
    return name;
};

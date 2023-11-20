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
        veloFactoryAddress: '0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a',
        lendingPoolAddress: '0x60F015F66F3647168831d31C7048ca95bb4FeaF9',
        leverageControllerAddress: '0xFb17bFAbA4345930ed48a8161df09f6fa141462C',
        strategies: {
            '0xf04458f7b21265b80fc340de7ee598e24485c5bb': {
                name: 'sAMMV2-USDC/LUSD',
                token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
                token1: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
            },
            '0x6387765ffa609ab9a1da1b16c455548bfed7cbea': {
                name: 'vAMMV2-WETH/LUSD',
                token0: '0x4200000000000000000000000000000000000006',
                token1: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
            },
            '0x6d5ba400640226e24b50214d2bbb3d4db8e6e15a': {
                name: 'sAMMV2-USDC/sUSD',
                token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
                token1: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
            },
            '0x19715771e30c93915a5bbda134d782b81a820076': {
                name: 'sAMMV2-USDC/DAI',
                token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
                token1: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
            },
            '0x6da98bde0068d10ddd11b468b197ea97d96f96bc': {
                name: 'vAMMV2-wstETH/WETH',
                token0: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
                token1: '0x4200000000000000000000000000000000000006',
            },
            '0x0493bf8b6dbb159ce2db2e0e8403e753abd1235b': {
                name: 'vAMMV2-WETH/USDC',
                token0: '0x4200000000000000000000000000000000000006',
                token1: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
            },
        },
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

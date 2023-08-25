export const NETWORKS: Record<string, any> = {
    optimism: {
        name: 'optimism',
        rpc: 'https://mainnet.optimism.io',
        subgraph: 'https://api.thegraph.com/subgraphs/name/vmex-finance/vmex-optimism',
        chainId: 10,
        explorer: 'https://explorer.optimism.io',
        backend: 'https://seal-app-bomfb.ondigitalocean.app',
        testing: false,
    },
    localhost: {
        name: 'localhost',
        rpc: 'http://127.0.0.1:8545',
        subgraph: 'http://127.0.0.1:8000/subgraphs/name/vmex-finance',
        chainId: 31337,
        explorer: 'https://etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // replace later
        testing: true,
    },
    sepolia: {
        name: 'sepolia',
        rpc: 'https://eth-sepolia.public.blastapi.io',
        subgraph: 'https://api.studio.thegraph.com/query/40387/vmex-finance-sepolia/version/latest',
        chainId: 11155111,
        explorer: 'https://sepolia.etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // replace later
        testing: true,
    },
    mainnet: {
        name: 'mainnet',
        rpc: '', // Fill in
        subgraph: '', // fill in
        chainId: 1,
        explorer: 'https://etherscan.io',
        backend: 'https://dolphin-app-ajfiy.ondigitalocean.app', // replace later
        testing: false,
    },
};

export const DEFAULT_NETWORK = 'optimism';

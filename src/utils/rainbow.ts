import '@rainbow-me/rainbowkit/styles.css';
import {
    connectorsForWallets,
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {
    coinbaseWallet,
    injectedWallet,
    metaMaskWallet,
    rainbowWallet,
    trustWallet,
    walletConnectWallet,
    ledgerWallet,
    imTokenWallet,
    braveWallet,
} from '@rainbow-me/rainbowkit/wallets';
import merge from 'lodash.merge';
import { NETWORK } from './constants';

const determineChain = () => {
    switch (NETWORK.toLowerCase()) {
        case 'goerli':
            return [chain.goerli];
        case 'sepolia':
            return [chain.sepolia];
        case 'localhost':
        case 'optimism_localhost':
            return [chain.hardhat];
        case 'optimism':
            return [chain.optimism, chain.sepolia];
        default:
            return [chain.mainnet];
    }
};

export const { chains, provider } = configureChains(determineChain(), [publicProvider()]);

export const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [metaMaskWallet({ chains })],
    },
    {
        groupName: 'Popular',
        wallets: [
            coinbaseWallet({ appName: 'VMEX Finance App', chains }),
            rainbowWallet({ chains }),
            trustWallet({ chains }),
            ledgerWallet({ chains }),
            walletConnectWallet({ chains }),
            imTokenWallet({ chains }),
            braveWallet({ chains }),
            injectedWallet({ chains }),
        ],
    },
]);

export const walletTheme = merge(
    lightTheme({
        borderRadius: 'small',
        accentColor: '#7667db',
    }),
);

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

export { WagmiConfig, RainbowKitProvider };

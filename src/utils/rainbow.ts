import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, sepolia, hardhat } from 'wagmi/chains';
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
import { TESTING } from './constants';

const determineChains = () => {
    if (TESTING) return [optimism, sepolia, hardhat];
    else return [optimism, sepolia];
};

export const { chains, provider } = configureChains(determineChains(), [publicProvider()]);

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

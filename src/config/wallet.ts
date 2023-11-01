import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig, Chain } from 'wagmi';
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
import { availableNetworks } from '../utils/network';

export const { chains, provider } = configureChains(availableNetworks('wagmi') as Chain[], [
    publicProvider(),
]);

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

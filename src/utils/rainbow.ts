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

export const { chains, provider } = configureChains(
    [
        process.env.REACT_APP_NETWORK === 'goerli'
            ? chain.goerli
            : process.env.REACT_APP_NETWORK === 'sepolia'
            ? chain.sepolia
            : process.env.REACT_APP_NETWORK === 'localhost' ||
              process.env.REACT_APP_NETWORK === 'optimism_localhost'
            ? chain.hardhat
            : process.env.REACT_APP_NETWORK === 'optimism'
            ? chain.optimism
            : chain.mainnet,
    ],
    [publicProvider()],
);

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
    autoConnect: false,
    connectors,
    provider,
});

export { WagmiConfig, RainbowKitProvider };

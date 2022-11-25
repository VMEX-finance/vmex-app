import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useProvider, useSigner, useAccount } from 'wagmi';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@wagmi/core';

export const { chains, provider } = configureChains([chain.mainnet], [publicProvider()]);

export const { connectors } = getDefaultWallets({
    appName: 'VMEX',
    chains,
});

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

export interface IWalletState {
    provider?: Web3Provider | JsonRpcProvider | Provider;
    address?: string;
    signer?: Signer;
    isLoading: boolean;
    error: null | string;
}

const WalletState: IWalletState = {
    isLoading: false,
    error: null,
};

export { WagmiConfig, RainbowKitProvider };

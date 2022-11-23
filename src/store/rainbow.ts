import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
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
    signer?: Signer | any;
    isLoading: boolean;
    error: null | string;
}

const WalletState: IWalletState = {
    isLoading: false,
    error: null,
};

export const loginWithRainbow = createAsyncThunk('connect_rainbow', async (thunkAPI) => {
    // if (process.env.REACT_APP_TEST) {
    //     console.log('authenticating with localhost provider');
    //     const provider = new JsonRpcProvider(process.env.REACT_APP_RPC);
    //     const signer = provider.getSigner();
    //     const address = await signer.getAddress();
    //     // TODO: figure out why this code hangs!
    //     // await provider.send("hardhat_setBalance", [
    //     //     await signer.getAddress(),
    //     //     formatEther("100.0")
    //     // ])

    //     return {
    //         signer,
    //         address,
    //         provider,
    //     };
    // }
    // if (!(window as any).ethereum) {
    //     // TODO: try with web3modal instead in here
    //     throw Error('Please install Rainbow Kit browser extension');
    // }

    const provider = useProvider();
    const { data: signer } = useSigner();
    const { address } = useAccount();
    return {
        signer,
        address,
        provider,
    };
});

export const WalletSlice = createSlice({
    name: 'wallet',
    initialState: WalletState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginWithRainbow.fulfilled, (state, action) => {
            state.signer = action.payload?.signer;
            state.address = action.payload?.address;
            state.provider = action.payload?.provider;
        });

        builder.addCase(loginWithRainbow.rejected, (state, action) => {
            throw new Error('Failed to authenticate with Rainbow Kit');
        });
    },
});

export default WalletSlice.reducer;

export { WagmiConfig, RainbowKitProvider };

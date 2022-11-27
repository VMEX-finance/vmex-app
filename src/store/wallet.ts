import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { formatEther } from '@ethersproject/units';

export interface IWalletState {
    provider?: Web3Provider | JsonRpcProvider;
    address?: string;
    signer?: Signer;
    isLoading: boolean;
    error: null | string;
}

const WalletState: IWalletState = {
    isLoading: false,
    error: null,
};

export const loginWithMetamask = createAsyncThunk('connect_metamask', async (data, thunkAPI) => {
    let isLoading = true;
    if (process.env.REACT_APP_TEST) {
        console.log('authenticating with localhost provider');
        const provider = new JsonRpcProvider(process.env.REACT_APP_RPC);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        isLoading = false;

        return {
            signer,
            address,
            provider,
            isLoading,
        };
    }
    if (!(window as any).ethereum) {
        // TODO: try with web3modal instead in here
        throw Error('Please install Metamask browser extension');
    }
    const provider = new Web3Provider((window as any).ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    isLoading = false;

    return {
        signer,
        address,
        provider,
        isLoading,
    };
});

export const WalletSlice = createSlice({
    name: 'wallet',
    initialState: WalletState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginWithMetamask.fulfilled, (state, action) => {
            state.signer = action.payload?.signer;
            state.address = action.payload?.address;
            state.provider = action.payload?.provider;
            state.isLoading = action.payload?.isLoading;
        });

        builder.addCase(loginWithMetamask.rejected, (state, action) => {
            throw new Error('Failed to authenticate with Metamask');
        });
    },
});

export default WalletSlice.reducer;

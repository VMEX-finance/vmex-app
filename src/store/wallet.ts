import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Web3Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";

export interface IWalletState {
    provider?: Web3Provider;
    address?: string;
    signer?: Signer;
    isLoading: boolean;
    error: null | string;
}

const WalletState: IWalletState = {
    isLoading: false,
    error: null
}

export const loginWithMetamask = createAsyncThunk(
    "connect_metamask",
    async (data, thunkAPI) => {
        if (!(window as any).ethereum) throw Error("Please install Metamask browser extension");
        const provider = new Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return {
            signer,
            address,
            provider
        }
    }
)

export const WalletSlice = createSlice({
    name: "wallet",
    initialState: WalletState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(loginWithMetamask.fulfilled, (state, action) => {
            state.signer = action.payload?.signer
            state.address = action.payload?.address
            state.provider = action.payload?.provider
        })

        builder.addCase(loginWithMetamask.rejected, (state, action) => {
            throw new Error("Failed to authenticate with Metamask")
        })
    }
})

export default WalletSlice.reducer

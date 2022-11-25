import { JsonRpcProvider } from '@ethersproject/providers';

export const NETWORK = process.env.REACT_APP_TEST ? 'localhost' : 'mainnet';

export const SDK_PARAMS = {
    network: NETWORK,
    test: process.env.REACT_APP_TEST ? true : false,
    signer: new JsonRpcProvider(process.env.REACT_APP_RPC).getSigner(),
};

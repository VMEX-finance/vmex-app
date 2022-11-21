export const NETWORK = process.env.REACT_APP_TEST ? 'localhost' : 'mainnet';

export const SDK_PARAMS = {
    network: NETWORK,
    test: process.env.REACT_APP_TEST ? true : false,
};

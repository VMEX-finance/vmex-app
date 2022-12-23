export type IAssetPricesProps = {
    oracle: string;
    usdPrice: number;
};

export type IPricesDataProps = {
    prices: Record<string, IAssetPricesProps>;
    isLoading: boolean;
    isError: boolean;
};

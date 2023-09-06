export type IAssetApyProps = {
    vaultAddress: string;
    vaultName: string;
    assetAddress: string;
    assetSymbol: string;
    apy: string;
};

export type IAssetApyQueryProps = {
    apys:
        | {
              assetAddress: string;
              totalApy: number;
              assetSymbol?: string;
              rewards: IAssetApyProps[];
          }[]
        | undefined;
    isLoading: boolean;
    isError: boolean;
};

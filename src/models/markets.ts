export type MarketsAsset = {
  asset: string;
  logo: string;
  supplyTotal: number | string;
  supplyApy: number | string;
  borrowTotal: number | string;
  borrowApy: number | string;
  poolSize: number | string;
}

export const _mockAvailableAsset: MarketsAsset = {
  asset: "USDC",
  logo: "tokens/token-USDC.svg",
  supplyTotal: 22.18,
  supplyApy: 0.77,
  borrowTotal: 8.44,
  borrowApy: 2.11,
  poolSize: 12.7,

}

export const _mockAvailableAsset2: MarketsAsset = {
  asset: "WBTC",
  logo: "tokens/token-WBTC.svg",
  supplyTotal: 8.73,
  supplyApy: 1.21,
  borrowTotal: 4.19,
  borrowApy: 1.81,
  poolSize: 9.1,
}

export const _mockAvailableAsset3: MarketsAsset = {
  asset: "DAI",
  logo: "tokens/token-DAI.svg",
  supplyTotal: 17.22,
  supplyApy: 0.98,
  borrowTotal: 11.24,
  borrowApy: 2.04,
  poolSize: 10.9,
}

export const _mockMarketsData: Array<MarketsAsset> = [_mockAvailableAsset, _mockAvailableAsset2, _mockAvailableAsset3];
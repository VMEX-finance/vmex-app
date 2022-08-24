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
  supplyTotal: 12.44,
  supplyApy: 0.77,
  borrowTotal: 8.44,
  borrowApy: 2.11,
  poolSize: 12.7,

}

export const _mockAvailableAsset2: MarketsAsset = {
  asset: "XRP",
  logo: "tokens/token-XRP.svg",
  supplyTotal: 12.44,
  supplyApy: 0.77,
  borrowTotal: 8.44,
  borrowApy: 2.11,
  poolSize: 12.7,
}

export const _mockAvailableAsset3: MarketsAsset = {
  asset: "BTC",
  logo: "tokens/token-BTC.svg",
  supplyTotal: 12.44,
  supplyApy: 0.77,
  borrowTotal: 8.44,
  borrowApy: 2.11,
  poolSize: 12.7,
}

export const _mockMarketsData: Array<MarketsAsset> = [_mockAvailableAsset, _mockAvailableAsset2, _mockAvailableAsset3, _mockAvailableAsset, _mockAvailableAsset2, _mockAvailableAsset];
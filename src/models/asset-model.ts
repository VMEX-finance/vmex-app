import { BigNumber } from "@ethersproject/bignumber";

type AssetBaseData = {
    symbol: string;
    address: string;
    price: BigNumber | number;
    name?: string;
    decimals?: number;
}

type AssetTrancheData = {
    debtTokenBalance: BigNumber | number;
    aToken_balance: BigNumber | number;
    insured_balance: BigNumber | number;
}

type K = string;
// type AssetData = Pick<AssetBaseData, K extends keyof AssetBaseData>


interface AssetUserData {
    asset: AssetBaseData;
    user_balance: BigNumber | number;
    debt_token: string;
    collateral_token: string;
    collateral_balance: BigNumber | number;
    debt_balance: BigNumber | number;
}

export {}
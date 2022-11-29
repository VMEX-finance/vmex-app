import { BigNumber } from '@ethersproject/bignumber';

export type AssetTranches = [
    {
        shortName: string;
        debtTokenAddress: string;
        enabled?: boolean;
    },
];

export interface Asset {
    symbol: string;
    logo_path: string;
    user_balance: BigNumber | number;
    lending_rate: BigNumber | number;
    collateral?: boolean;
    tranches: AssetTranches[];
}

export type AvailableAsset = {
    asset: string;
    amount?: number | string;
    apy_perc?: number | string;
    canBeCollat?: boolean;
    liquidity?: number | string;
};

type Tranch = {
    name: string;
    address: string;
    disabled?: boolean;
};

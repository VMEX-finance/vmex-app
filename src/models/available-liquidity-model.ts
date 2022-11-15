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
    logo: string;
    unit: string;
    amount: number;
    apy_perc: number;
    canBeCollat: boolean;
    liquidity?: number;
    tranches: Tranch[];
};

type Tranch = {
    name: string;
    address: string;
    disabled?: boolean;
};

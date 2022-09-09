export type AvailableAsset = {
    asset: string;
    logo: string;
    unit: string;
    amount: number;
    apy_perc: number;
    canBeCollat: boolean;
    tranches: Tranch[]
}

type Tranch = {
    name: string,
    address: string
    disabled?: boolean
}

export const _mockAvailableAsset: AvailableAsset = {
    asset: "USDC",
    logo: "tokens/token-USDC.svg",
    unit: "USDC",
    amount: 9921,
    apy_perc: .0078,
    canBeCollat: true,
    tranches: [
        {
            name: "Stable Asset Tranche",
            address: "",
            disabled: false
        },
        {
            name: "High Cap Tranche",
            address: "",
            disabled: false
        },
        {
            name: "Low Cap Tranche",
            address: "",
            disabled: true
        },
    ]
}

export const _mockAvailableAsset2: AvailableAsset = {
    asset: "WBTC",
    logo: "tokens/token-WBTC.svg",
    unit: "WBTC",
    amount: 2394,
    apy_perc: .0053,
    canBeCollat: false,
    tranches: [
        {
            name: "Stable Asset Tranche",
            address: "",
            disabled: true
        },
        {
            name: "High Cap Tranche",
            address: "",
            disabled: true
        },
        {
            name: "Low Cap Tranche",
            address: "",
            disabled: false
        }
    ]
}

export const _mockAvailableAsset3: AvailableAsset = {
    asset: "DAI",
    logo: "tokens/token-DAI.svg",
    unit: "DAI",
    amount: 9128,
    apy_perc: .0103,
    canBeCollat: true,
    tranches: [
        {
            name: "Stable Asset Tranche",
            address: "",
            disabled: false
        },
        {
            name: "High Cap Tranche",
            address: "",
            disabled: false
        },
        {
            name: "Low Cap Tranche",
            address: "",
            disabled: true
        }
    ]
}

export const _mockAssetData: any = {
    data: [_mockAvailableAsset, _mockAvailableAsset2, _mockAvailableAsset3]
}

export {}
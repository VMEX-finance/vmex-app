export const MOCK_TOP_ASSETS = [
    {
        asset: 'BTC',
        val: 3320000,
    },
    {
        asset: 'XRP',
        val: 2341300,
    },
    {
        asset: 'WBTC',
        val: 2198344,
    },
    {
        asset: 'USDC',
        val: 1934000,
    },
    {
        asset: 'DAI',
        val: 1732990,
    },
    {
        asset: 'AAVE',
        val: 1638440,
    },
];

export const MOCK_TOP_TRANCHES = [
    {
        name: 'VMEX High',
        borrowed: 981000,
        supplied: 1040000,
    },
    {
        name: 'VMEX Mid',
        borrowed: 834994,
        supplied: 995214,
    },
    {
        name: 'VMEX Low',
        borrowed: 763000,
        supplied: 799835,
    },
    {
        name: 'VMEX High',
        borrowed: 689122,
        supplied: 693800,
    },
    {
        name: 'VMEX Mid',
        borrowed: 612321,
        supplied: 632839,
    },
    {
        name: 'VMEX Low',
        borrowed: 532888,
        supplied: 587329,
    },
];

export const MOCK_YOUR_BORROWS = [
    {
        trancheId: 0,
        asset: 'USDC',
        amount: 9833,
        apy: 0.0292,
        tranche: 'VMEX High Quality',
    },
    {
        trancheId: 1,
        asset: 'WETH',
        amount: 1.323452,
        apy: 0.031,
        tranche: 'VMEX High Quality',
    },
    {
        trancheId: 2,
        asset: 'DAI',
        amount: 3980,
        apy: 0.048,
        tranche: 'VMEX High Quality',
    },
];

export const MOCK_YOUR_SUPPLIES = [
    {
        trancheId: 0,
        asset: 'DAI',
        amount: 9000,
        collateral: true,
        apy: 0.04,
        tranche: 'VMEX High Quality',
    },
    {
        trancheId: 1,
        asset: 'USDC',
        amount: 8000,
        collateral: true,
        apy: 0.025,
        tranche: 'VMEX High Quality',
    },
    {
        trancheId: 2,
        asset: 'WBTC',
        amount: 0.8621287,
        collateral: false,
        apy: 0.038,
        tranche: 'VMEX Mid Quality',
    },
];

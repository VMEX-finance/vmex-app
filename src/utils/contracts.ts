export const CONTRACTS = {
    5: {
        // Goerli
        dvmex: '0xF52917a2D7b3B03521FC31520dA719b685BD8c20', // dVMEX
        vmex: '0xd0eEfD79b19Eb8c26856453A487aeFbEdD85127f', // VMEX
        vevmex: '0x45401450C63b31e83d0131f7361f92d774A5CFcc', // veVMEX
        vmexRewards: '0x0DBf06F61ABF8dbA10947c49DA14222CBb3B4c7C', // VMEX Reward Pool
        dvmexRewards: '0x4D30446Bc8dF00F97f9ace6299587B37F5e5e9Bc', // dVMEX Reward Pool
        gaugeFactory: '0x8267B599a0bbcBd142c9e49445D4307C419927C7', // Gauage Factory
        registery: '0x4A5Fe07ED053273eB9ef4bCcD7762bEca1D22477', // Registery
        vmexWeth: '0xad302e620FEDb60078B33514757335545ba05c6D', // vmexWeth Pool
        redemption: '0x7e1b80bD1b4aBBF5876cE57bE34D33a526501aC5', // Redemption
    },
    10: {
        // Optimism
        veloRouter: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858', // VELO Router
        veloFactory: '0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a', // VELO Factory
        lendingPool: '0x60F015F66F3647168831d31C7048ca95bb4FeaF9', // Lending Pool
        leverageController: '0x69d61714e902C9c337394424C5fC2482f00bfC70', // Leverage Controller
        dvmex: '', // dVMEX
        vmex: '', // VMEX
        vevmex: '', // veVMEX
        vmexRewards: '', // VMEX Reward Pool
        dvmexRewards: '', // dVMEX Reward Pool
        gaugeFactory: '', // Gauage Factory
        registery: '', // Registery
        vmexWeth: '', // vmexWeth Pool
        redemption: '', // Redemption
    },
};

export const STRATEGIES = {
    10: {
        '0xf04458f7b21265b80fc340de7ee598e24485c5bb': {
            name: 'sAMMV2-USDC/LUSD',
            token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
            token1: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
        },
        '0x6387765ffa609ab9a1da1b16c455548bfed7cbea': {
            name: 'vAMMV2-WETH/LUSD',
            token0: '0x4200000000000000000000000000000000000006',
            token1: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
        },
        '0x6d5ba400640226e24b50214d2bbb3d4db8e6e15a': {
            name: 'sAMMV2-USDC/sUSD',
            token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
            token1: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
        },
        '0x19715771e30c93915a5bbda134d782b81a820076': {
            name: 'sAMMV2-USDC/DAI',
            token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
            token1: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        },
        '0x6da98bde0068d10ddd11b468b197ea97d96f96bc': {
            name: 'vAMMV2-wstETH/WETH',
            token0: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
            token1: '0x4200000000000000000000000000000000000006',
        },
        '0x0493bf8b6dbb159ce2db2e0e8403e753abd1235b': {
            name: 'vAMMV2-WETH/USDC',
            token0: '0x4200000000000000000000000000000000000006',
            token1: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        },
    },
};

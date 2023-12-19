export const CONTRACTS = {
    5: {
        // Goerli
        dvmex: '0xBce70d5081D0a594b249Bd0C5872cB038A2f7F3f', // dVMEX
        vmex: '0xd0eEfD79b19Eb8c26856453A487aeFbEdD85127f', // VMEX
        vmexComputed: '0x711c60FbD45fE5C106bB661304c26314172165f3',
        vevmex: '0x8224acafafD9E0FfBeB76fd6dd933bD0C2288466', // veVMEX
        vmexRewards: '0x711c60FbD45fE5C106bB661304c26314172165f3', // VMEX Reward Pool
        dvmexRewards: '0x7dc0ed5e83c5e8D1022b8070D2ab73C4b88f3132', // dVMEX Reward Pool
        gaugeFactory: '0x911D5bf3cD7D27A718F29bf1977Ca5bA9498e5B8', // Gauage Factory
        registery: '0xA186ef560bb27Ff2e39738A906271864fa58A09D', // Registery
        vmexWeth: '0x4FA6086ED10C971D255aa1B09a6beB1C7bE5ca37', // vmexWeth Pool
        redemption: '0x074C4A63632B8E66fcE6858C293a5B4210159067', // Redemption
        gauges: [
            '0x19E008c221B5297063F729e25B450754366aF83e', // VMEX
            '0x28fdb3bC3D8D3304D85194C88aD83470634aA51b', // WETH
        ],
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
        gauges: [''],
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

// VMEX START TIME: 1703718921
// dVMEX START TIME: 1703718921

import { INetworkContracts } from '@/types/network';
import { constants } from 'ethers';

export const CONTRACTS: Record<5 | 10, INetworkContracts> = {
    5: {
        // Goerli
        veloRouter: constants.AddressZero, // VELO Router
        veloFactory: constants.AddressZero, // VELO Factory
        lendingPool: constants.AddressZero, // Lending Pool
        leverageController: constants.AddressZero, // Leverage Controller
        dvmex: '0xB124e57FbA2624Dbe9FD147245630c4299c51569', // dVMEX
        vmex: '0xd0eEfD79b19Eb8c26856453A487aeFbEdD85127f', // VMEX
        vmexComputed: '0x61EADfFbE50c1b97f7309Cac313A4FC49569e24D',
        vevmex: '0x8224acafafD9E0FfBeB76fd6dd933bD0C2288466', // veVMEX
        vmexRewards: '0x61EADfFbE50c1b97f7309Cac313A4FC49569e24D', // VMEX Reward Pool
        dvmexRewards: '0x0cbCBa330C3904672E90f9D1A4a5918D5b1691ac', // dVMEX Reward Pool
        gaugeFactory: '0x71b5F73cE44254Db01c949632C750797897Df50F', // Gauage Factory
        registry: '0x6904E008a42541A91a6b58B80ea4D5a45D9Cc844', // registry
        vmexWeth: '0x3e5FA9518eA95c3E533EB377C001702A9AaCAA32', // vmexWeth Pool
        redemption: '0x9041Efc8fa750173f22E1fc67b5dAdB942eaBfaC', // Redemption
    },
    10: {
        // Optimism
        veloRouter: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858', // VELO Router
        veloFactory: '0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a', // VELO Factory
        lendingPool: '0x60F015F66F3647168831d31C7048ca95bb4FeaF9', // Lending Pool
        leverageController: '0x69d61714e902C9c337394424C5fC2482f00bfC70', // Leverage Controller
        dvmex: '0xb5359eCdc13f055DF2b433520F9Df35D68F49D3d', // dVMEX
        vmex: '0x6D2E5b8841a6Aa5f0f973436357f75D3Eeb93312', // VMEX
        vevmex: '0xD5A3E749a03c2f9645fdF2d755f96e407d0A2D5a', // veVMEX
        vmexRewards: '0xecF3e854D428074d116DE6f31213522F6525Cf81', // VMEX Reward Pool
        dvmexRewards: '0xC4F1050a3216b116a78133038912BC3b9506aEF0', // dVMEX Reward Pool
        gaugeFactory: '0x9D2105416cE030c4dE41Eea9C37c83a065508977', // Gauage Factory
        registry: '0xe04B52356246C3b21CA796799532f4C1Fb7ac4A7', // registry
        vmexWeth: '0x4Dde571Dc66217a062e4B50f9b20c4D08b3245a0', // vmexWeth Pool
        redemption: '0xFC98797C100CA3ef8D35CF92D69a9aC4CdFF8D99', // Redemption
        vmexComputed: '0xecF3e854D428074d116DE6f31213522F6525Cf81',
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

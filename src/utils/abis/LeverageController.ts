export const LeverageControllerABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_lendingPool',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_veloFactory',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_veloRouter',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_vmexOracle',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_assetMappings',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'assetMappings',
        outputs: [
            {
                internalType: 'contract IAssetMappings',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lendingPool',
        outputs: [
            {
                internalType: 'contract ILendingPool',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'lpToken',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'trancheId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'token0',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals0',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'token1',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals1',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LeverageController.LeverageDetails',
                name: 'params',
                type: 'tuple',
            },
            {
                internalType: 'uint256',
                name: 'totalBorrowAmount',
                type: 'uint256',
            },
        ],
        name: 'leverageVeloLp',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'lpToken',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'trancheId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'token0',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals0',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'token1',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals1',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LeverageController.LeverageDetails',
                name: 'params',
                type: 'tuple',
            },
            {
                internalType: 'uint256',
                name: 'totalBorrowAmount',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'token',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable0',
                        type: 'bool',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable1',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LeverageController.BorrowTokenDetails',
                name: 'borrowParams',
                type: 'tuple',
            },
        ],
        name: 'leverageVeloLpBorrowOther',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'lpToken',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'trancheId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'token0',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals0',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'token1',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'decimals1',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LeverageController.LeverageDetails',
                name: 'params',
                type: 'tuple',
            },
            {
                internalType: 'uint256',
                name: 'totalBorrowAmount',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'isBorrowToken0',
                type: 'bool',
            },
        ],
        name: 'leverageVeloLpZap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint64',
                        name: 'trancheId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'lpToken',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenA',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenB',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable',
                        type: 'bool',
                    },
                    {
                        internalType: 'address',
                        name: 'aToken',
                        type: 'address',
                    },
                ],
                internalType: 'struct LeverageController.UnwindVeloDetails',
                name: 'params',
                type: 'tuple',
            },
            {
                internalType: 'uint256',
                name: 'totalUnwindAmountUsd',
                type: 'uint256',
            },
        ],
        name: 'unwindVeloLeverageOneBorrow',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint64',
                        name: 'trancheId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'address',
                        name: 'lpToken',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenA',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenB',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'stable',
                        type: 'bool',
                    },
                    {
                        internalType: 'address',
                        name: 'aToken',
                        type: 'address',
                    },
                ],
                internalType: 'struct LeverageController.UnwindVeloDetails',
                name: 'params',
                type: 'tuple',
            },
            {
                internalType: 'uint256',
                name: 'totalUnwindAmountUsd',
                type: 'uint256',
            },
        ],
        name: 'unwindVeloLeverageTwoBorrow',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'veloFactory',
        outputs: [
            {
                internalType: 'contract IPoolFactory',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'veloRouter',
        outputs: [
            {
                internalType: 'contract IRouter',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'vmexOracle',
        outputs: [
            {
                internalType: 'contract IPriceOracleGetter',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

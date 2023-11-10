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
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'log',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'log_address',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256[]',
                name: 'val',
                type: 'uint256[]',
            },
        ],
        name: 'log_array',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'int256[]',
                name: 'val',
                type: 'int256[]',
            },
        ],
        name: 'log_array',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address[]',
                name: 'val',
                type: 'address[]',
            },
        ],
        name: 'log_array',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'log_bytes',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        name: 'log_bytes32',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        name: 'log_int',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'val',
                type: 'address',
            },
        ],
        name: 'log_named_address',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'uint256[]',
                name: 'val',
                type: 'uint256[]',
            },
        ],
        name: 'log_named_array',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'int256[]',
                name: 'val',
                type: 'int256[]',
            },
        ],
        name: 'log_named_array',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'address[]',
                name: 'val',
                type: 'address[]',
            },
        ],
        name: 'log_named_array',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'val',
                type: 'bytes',
            },
        ],
        name: 'log_named_bytes',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'val',
                type: 'bytes32',
            },
        ],
        name: 'log_named_bytes32',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'int256',
                name: 'val',
                type: 'int256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'decimals',
                type: 'uint256',
            },
        ],
        name: 'log_named_decimal_int',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'val',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'decimals',
                type: 'uint256',
            },
        ],
        name: 'log_named_decimal_uint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'int256',
                name: 'val',
                type: 'int256',
            },
        ],
        name: 'log_named_int',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'val',
                type: 'string',
            },
        ],
        name: 'log_named_string',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'key',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'val',
                type: 'uint256',
            },
        ],
        name: 'log_named_uint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        name: 'log_string',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'log_uint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'logs',
        type: 'event',
    },
    {
        inputs: [],
        name: 'IS_TEST',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'excludeArtifacts',
        outputs: [
            {
                internalType: 'string[]',
                name: 'excludedArtifacts_',
                type: 'string[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'excludeContracts',
        outputs: [
            {
                internalType: 'address[]',
                name: 'excludedContracts_',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'excludeSenders',
        outputs: [
            {
                internalType: 'address[]',
                name: 'excludedSenders_',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'failed',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
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
                internalType: 'address',
                name: 'borrowToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'borrowTokenDecimals',
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
        inputs: [],
        name: 'targetArtifactSelectors',
        outputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'addr',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4[]',
                        name: 'selectors',
                        type: 'bytes4[]',
                    },
                ],
                internalType: 'struct StdInvariant.FuzzSelector[]',
                name: 'targetedArtifactSelectors_',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'targetArtifacts',
        outputs: [
            {
                internalType: 'string[]',
                name: 'targetedArtifacts_',
                type: 'string[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'targetContracts',
        outputs: [
            {
                internalType: 'address[]',
                name: 'targetedContracts_',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'targetInterfaces',
        outputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'addr',
                        type: 'address',
                    },
                    {
                        internalType: 'string[]',
                        name: 'artifacts',
                        type: 'string[]',
                    },
                ],
                internalType: 'struct StdInvariant.FuzzInterface[]',
                name: 'targetedInterfaces_',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'targetSelectors',
        outputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'addr',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes4[]',
                        name: 'selectors',
                        type: 'bytes4[]',
                    },
                ],
                internalType: 'struct StdInvariant.FuzzSelector[]',
                name: 'targetedSelectors_',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'targetSenders',
        outputs: [
            {
                internalType: 'address[]',
                name: 'targetedSenders_',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
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

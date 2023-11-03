export const LendingPoolABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'onBehalfOf',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'borrowRate',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'uint16',
                name: 'referral',
                type: 'uint16',
            },
        ],
        name: 'Borrow',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: true,
                internalType: 'bool',
                name: 'verified',
                type: 'bool',
            },
        ],
        name: 'ConfigurationAdminVerifiedUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'onBehalfOf',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'uint16',
                name: 'referral',
                type: 'uint16',
            },
        ],
        name: 'Deposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EverythingPaused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EverythingUnpaused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'collateralAsset',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'debtAsset',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'debtToCover',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'liquidatedCollateralAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'liquidator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'receiveAToken',
                type: 'bool',
            },
        ],
        name: 'LiquidationCall',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'repayer',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Repay',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'liquidityRate',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'variableBorrowRate',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'liquidityIndex',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'variableBorrowIndex',
                type: 'uint256',
            },
        ],
        name: 'ReserveDataUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'ReserveUsedAsCollateralDisabled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'ReserveUsedAsCollateralEnabled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Withdraw',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'isBlacklisted',
                type: 'bool',
            },
        ],
        name: 'addToBlacklist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'isWhitelisted',
                type: 'bool',
            },
        ],
        name: 'addToWhitelist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'uint16',
                name: 'referralCode',
                type: 'uint16',
            },
            {
                internalType: 'address',
                name: 'onBehalfOf',
                type: 'address',
            },
        ],
        name: 'borrow',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'onBehalfOf',
                type: 'address',
            },
            {
                internalType: 'uint16',
                name: 'referralCode',
                type: 'uint16',
            },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'balanceFromAfter',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'balanceToBefore',
                type: 'uint256',
            },
        ],
        name: 'finalizeTransfer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAddressesProvider',
        outputs: [
            {
                internalType: 'contract ILendingPoolAddressesProvider',
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
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getConfiguration',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'data',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct DataTypes.ReserveConfigurationMap',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getReserveData',
        outputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'data',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct DataTypes.ReserveConfigurationMap',
                        name: 'configuration',
                        type: 'tuple',
                    },
                    {
                        internalType: 'uint128',
                        name: 'liquidityIndex',
                        type: 'uint128',
                    },
                    {
                        internalType: 'uint128',
                        name: 'variableBorrowIndex',
                        type: 'uint128',
                    },
                    {
                        internalType: 'uint128',
                        name: 'currentLiquidityRate',
                        type: 'uint128',
                    },
                    {
                        internalType: 'uint128',
                        name: 'currentVariableBorrowRate',
                        type: 'uint128',
                    },
                    {
                        internalType: 'uint40',
                        name: 'lastUpdateTimestamp',
                        type: 'uint40',
                    },
                    {
                        internalType: 'address',
                        name: 'aTokenAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'variableDebtTokenAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint8',
                        name: 'id',
                        type: 'uint8',
                    },
                    {
                        internalType: 'address',
                        name: 'interestRateStrategyAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'baseLTV',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'liquidationThreshold',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'liquidationBonus',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint64',
                        name: 'borrowFactor',
                        type: 'uint64',
                    },
                ],
                internalType: 'struct DataTypes.ReserveData',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getReserveNormalizedIncome',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getReserveNormalizedVariableDebt',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getReservesList',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        name: 'getTrancheParams',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint8',
                        name: 'reservesCount',
                        type: 'uint8',
                    },
                    {
                        internalType: 'bool',
                        name: 'paused',
                        type: 'bool',
                    },
                    {
                        internalType: 'bool',
                        name: 'isUsingWhitelist',
                        type: 'bool',
                    },
                    {
                        internalType: 'bool',
                        name: 'verified',
                        type: 'bool',
                    },
                ],
                internalType: 'struct DataTypes.TrancheParams',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getUserAccountData',
        outputs: [
            {
                internalType: 'uint256',
                name: 'totalCollateralETH',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'totalDebtETH',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'availableBorrowsETH',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'currentLiquidationThreshold',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'ltv',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'healthFactor',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'avgBorrowFactor',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'getUserConfiguration',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'data',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct DataTypes.UserConfigurationMap',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'underlyingAsset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: 'aTokenAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'variableDebtAddress',
                type: 'address',
            },
        ],
        name: 'initReserve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'collateralAsset',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'debtAsset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'debtToCover',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'receiveAToken',
                type: 'bool',
            },
        ],
        name: 'liquidationCall',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'paused',
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
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'onBehalfOf',
                type: 'address',
            },
        ],
        name: 'repay',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'reserveAdded',
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
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'ltv',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'liquidationThreshold',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'liquidationBonus',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'borrowFactor',
                type: 'uint64',
            },
        ],
        name: 'setCollateralParams',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'uint256',
                name: 'configuration',
                type: 'uint256',
            },
        ],
        name: 'setConfiguration',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: 'val',
                type: 'bool',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
        ],
        name: 'setPause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: 'val',
                type: 'bool',
            },
        ],
        name: 'setPauseEverything',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'reserve',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: 'rateStrategyAddress',
                type: 'address',
            },
        ],
        name: 'setReserveInterestRateStrategyAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'bool',
                name: 'verified',
                type: 'bool',
            },
        ],
        name: 'setTrancheAdminVerified',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'bool',
                name: 'useAsCollateral',
                type: 'bool',
            },
        ],
        name: 'setUserUseReserveAsCollateral',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'bool',
                name: 'isUsingWhitelist',
                type: 'bool',
            },
        ],
        name: 'setWhitelistEnabled',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'trancheId',
                type: 'uint64',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'withdraw',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

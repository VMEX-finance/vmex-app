export const IncentivesControllerABI = [
    {
        type: 'function',
        name: 'DVMEX',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'DVMEX_REWARD_POOL',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'EMISSION_MANAGER',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'REWARDS_VAULT',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'VE_VMEX',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: '__DistributionManager_init',
        inputs: [
            {
                name: 'emissionManager',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'addressesProvider',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'contract ILendingPoolAddressesProvider',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'batchBeginStakingRewards',
        inputs: [
            {
                name: 'aTokens',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: 'stakingContracts',
                type: 'address[]',
                internalType: 'address[]',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'beginStakingReward',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'stakingContract',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'camelotTokenId',
        inputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'changeDistributionManager',
        inputs: [
            {
                name: 'newManager',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'claim',
        inputs: [
            {
                name: '_account',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '_rewardToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '_claimable',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '_proof',
                type: 'bytes32[]',
                internalType: 'bytes32[]',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'claimAllRewards',
        inputs: [
            {
                name: 'incentivizedAssets',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: 'to',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: '',
                type: 'uint256[]',
                internalType: 'uint256[]',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'claimDVmexReward',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '_account',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'claimed',
        inputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'configureRewards',
        inputs: [
            {
                name: 'config',
                type: 'tuple[]',
                internalType: 'struct IDistributionManager.RewardConfig[]',
                components: [
                    {
                        name: 'emissionPerSecond',
                        type: 'uint128',
                        internalType: 'uint128',
                    },
                    {
                        name: 'endTimestamp',
                        type: 'uint128',
                        internalType: 'uint128',
                    },
                    {
                        name: 'incentivizedAsset',
                        type: 'address',
                        internalType: 'address',
                    },
                    {
                        name: 'reward',
                        type: 'address',
                        internalType: 'address',
                    },
                ],
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'currRoot',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'curveGaugeFactory',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'earned',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '_account',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getAccruedRewards',
        inputs: [
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'reward',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getDVmexReward',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'tuple',
                internalType: 'struct IncentivesController.DVmexReward',
                components: [
                    {
                        name: 'periodFinish',
                        type: 'uint32',
                        internalType: 'uint32',
                    },
                    {
                        name: 'lastUpdateTime',
                        type: 'uint32',
                        internalType: 'uint32',
                    },
                    {
                        name: 'rewardRate',
                        type: 'uint64',
                        internalType: 'uint64',
                    },
                    {
                        name: 'rewardPerTokenStored',
                        type: 'uint128',
                        internalType: 'uint128',
                    },
                    {
                        name: 'decimals',
                        type: 'uint8',
                        internalType: 'uint8',
                    },
                    {
                        name: 'queuedRewards',
                        type: 'uint120',
                        internalType: 'uint120',
                    },
                    {
                        name: 'currentRewards',
                        type: 'uint128',
                        internalType: 'uint128',
                    },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getPendingRewards',
        inputs: [
            {
                name: 'assets',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: '',
                type: 'uint256[]',
                internalType: 'uint256[]',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getRewardsData',
        inputs: [
            {
                name: 'incentivizedAsset',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'reward',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getStakingContract',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: 'stakingContract',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getUserRewardIndex',
        inputs: [
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'incentivizedAsset',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'reward',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'handleAction',
        inputs: [
            {
                name: 'user',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'totalSupply',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'oldBalance',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'newBalance',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'action',
                type: 'uint8',
                internalType: 'enum DistributionTypes.Action',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'harvestReward',
        inputs: [
            {
                name: 'stakingContract',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'initialize',
        inputs: [
            {
                name: '_addressesProvider',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'nextBoostedBalanceOf',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '_account',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'onERC721Received',
        inputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'from',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: '',
                type: 'bytes',
                internalType: 'bytes',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bytes4',
                internalType: 'bytes4',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'onNFTAddToPosition',
        inputs: [
            {
                name: 'operator',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'lpAmount',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'onNFTHarvest',
        inputs: [
            {
                name: 'operator',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'to',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'grailAmount',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'xGrailAmount',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'onNFTWithdraw',
        inputs: [
            {
                name: 'operator',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'tokenId',
                type: 'uint256',
                internalType: 'uint256',
            },
            {
                name: 'lpAmount',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'queueNewRewards',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: '_amount',
                type: 'uint256',
                internalType: 'uint256',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'bool',
                internalType: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'removeStakingReward',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'rescueRewardTokens',
        inputs: [
            {
                name: 'reward',
                type: 'address',
                internalType: 'contract IERC20',
            },
            {
                name: 'receiver',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'rewardAdmin',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'setCurveGaugeFactory',
        inputs: [
            {
                name: 'newCurveGaugeFactory',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setDVmex',
        inputs: [
            {
                name: 'dVmex',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setDVmexRewardPool',
        inputs: [
            {
                name: 'penaltyReciever',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setRewardAdmin',
        inputs: [
            {
                name: 'newRewardAdmin',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setRewardsVault',
        inputs: [
            {
                name: 'rewardsVault',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setStakingType',
        inputs: [
            {
                name: '_stakingContracts',
                type: 'address[]',
                internalType: 'address[]',
            },
            {
                name: '_stakingTypes',
                type: 'uint8[]',
                internalType: 'enum IExternalRewardsDistributor.StakingType[]',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'setVeVmex',
        inputs: [
            {
                name: 'veVmex',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'stakingTypes',
        inputs: [
            {
                name: '',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [
            {
                name: '',
                type: 'uint8',
                internalType: 'enum IExternalRewardsDistributor.StakingType',
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'sweep',
        inputs: [
            {
                name: '_token',
                type: 'address',
                internalType: 'address',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'updateBoostedBalanceOf',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                internalType: 'address',
            },
            {
                name: 'users',
                type: 'address[]',
                internalType: 'address[]',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'updateRoot',
        inputs: [
            {
                name: '_newRoot',
                type: 'bytes32',
                internalType: 'bytes32',
            },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'CurveGaugeFactorySet',
        inputs: [
            {
                name: 'curveGaugeFactory',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'HarvestedReward',
        inputs: [
            {
                name: 'stakingContract',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'Initialized',
        inputs: [
            {
                name: 'version',
                type: 'uint8',
                indexed: false,
                internalType: 'uint8',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardAccrued',
        inputs: [
            {
                name: 'asset',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'reward',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'user',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'newIndex',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'newUserIndex',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardAdminChanged',
        inputs: [
            {
                name: 'rewardAdmin',
                type: 'address',
                indexed: false,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardClaimed',
        inputs: [
            {
                name: 'user',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'reward',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'to',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardConfigUpdated',
        inputs: [
            {
                name: 'asset',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'reward',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'emission',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'end',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
            {
                name: 'index',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardConfigured',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'staking',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'initialAmount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardsAccrued',
        inputs: [
            {
                name: 'user',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardsAdded',
        inputs: [
            {
                name: 'periodFinish',
                type: 'uint32',
                indexed: false,
                internalType: 'uint32',
            },
            {
                name: 'rewardRate',
                type: 'uint64',
                indexed: false,
                internalType: 'uint64',
            },
            {
                name: 'currentRewards',
                type: 'uint128',
                indexed: false,
                internalType: 'uint128',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RewardsClaimed',
        inputs: [
            {
                name: 'account',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'RootUpdated',
        inputs: [
            {
                name: 'newRoot',
                type: 'bytes32',
                indexed: true,
                internalType: 'bytes32',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'StakingRemoved',
        inputs: [
            {
                name: 'aToken',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'StakingTypeSet',
        inputs: [
            {
                name: 'stakingContract',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'stakingType',
                type: 'uint8',
                indexed: false,
                internalType: 'uint8',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'UserDeposited',
        inputs: [
            {
                name: 'user',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'aToken',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'UserTransfer',
        inputs: [
            {
                name: 'user',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'aToken',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
            {
                name: 'sender',
                type: 'bool',
                indexed: false,
                internalType: 'bool',
            },
        ],
        anonymous: false,
    },
    {
        type: 'event',
        name: 'UserWithdraw',
        inputs: [
            {
                name: 'user',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'aToken',
                type: 'address',
                indexed: true,
                internalType: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
                indexed: false,
                internalType: 'uint256',
            },
        ],
        anonymous: false,
    },
] as const;

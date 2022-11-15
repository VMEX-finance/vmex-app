import { AvailableAsset } from '../../models/available-liquidity-model';

export const MOCK_STAKE_ASSET_DATA: AvailableAsset = {
    asset: 'USDC',
    logo: 'tokens/token-USDC.svg',
    unit: 'USDC',
    amount: 9921,
    apy_perc: 0.0078,
    canBeCollat: true,
    liquidity: 18.3,
    tranches: [
        {
            name: 'Stable Asset Tranche',
            address: '',
            disabled: false,
        },
        {
            name: 'High Cap Tranche',
            address: '',
            disabled: false,
        },
        {
            name: 'Low Cap Tranche',
            address: '',
            disabled: true,
        },
    ],
};

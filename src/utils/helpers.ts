import { ethers } from 'ethers';

export function truncateAddress(s: string) {
    return `${s.slice(0, 3)}...${s.slice(-4)}`;
}

export const inputMediator = (s: string) => {
    return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '');
};

export const determineRatingColor = (s: string) => {
    if (s) {
        switch (s.toLowerCase()) {
            case 'a+':
                return '#00DD3E';
            case 'a':
                return '#61DD00';
            case 'a-':
                return '#89DD00';
            case 'b+':
                return '#A4DD00';
            case 'b':
                return '#D9DD00';
            case 'b-':
                return '#DDAC00';
            case 'c+':
                return '#FF7A00';
            case 'c':
                return '#FF1F00';
            case 'd':
                return '';
            case 'f':
                return '';
            default:
                return '';
        }
    }
};

export type IAvailableCoins =
    | 'AAVE'
    | 'BAT'
    | 'BUSD'
    | 'DAI'
    | 'ENJ'
    | 'KNC'
    | 'LINK'
    | 'MANA'
    | 'MKR'
    | 'REN'
    | 'SNX'
    | 'SUSD'
    | 'TUSD'
    | 'UNI'
    | 'USDC'
    | 'USDT'
    | 'WBTC'
    | 'WETH'
    | 'YFI'
    | 'ZRX'
    | 'Tricrypto2'
    | 'ThreePool'
    | 'StethEth'
    | 'Steth'
    | 'FraxUSDC'
    | 'Frax3Crv'
    | 'Frax'
    | 'BAL'
    | 'CRV'
    | 'CVX'
    | 'BADGER'
    | 'LDO'
    | 'ALCX'
    | 'Oneinch';

export const truncate = (str: string, show = 6) => {
    if (str && str.length > 20) {
        const first = str.substring(0, show);
        const last = str.substring(str.length - show, str.length);
        return `${first}...${last}`;
    }
    return str || '';
};

export const usdFormatter = (isCompact = true) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: isCompact ? 'compact' : 'standard',
    });

export const makeCompact = (amount: string | number | undefined, decimalsOnly = false) => {
    if (!amount) return '$0';
    let _amount: string;
    if (typeof amount === 'number') _amount = String(amount);
    else _amount = amount;
    if (decimalsOnly)
        return _amount.length > 5 && _amount.includes('.') ? _amount.split('.')[0] : _amount;
    if (_amount.includes('$')) _amount = _amount.slice(1);
    if (_amount.includes(',')) _amount = _amount.replaceAll(',', '');
    return usdFormatter().format(parseFloat(_amount));
};

export const numberFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
});

export const HFFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    maximumSignificantDigits: 4, //since percentages only have this many sig figs
});

export const nativeTokenFormatter = new Intl.NumberFormat('en-US', {
    notation: 'standard',
    minimumSignificantDigits: 5,
    maximumSignificantDigits: 8,
});

export const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact',
});

export const convertStringFormatToNumber = (amount: string | number) => {
    if (!amount) return 'N/A';
    return amount.toString().replaceAll(',', '');
};

export const convertContractsPercent = (amount: string) => {
    if (!amount) return 'N/A';
    console.log('Amount: ', amount);
    return ethers.utils.formatUnits(amount.split('.')[0], 18);
};

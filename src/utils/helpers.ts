export function truncateAddress(s: string) {
    return `${s.slice(0, 3)}...${s.slice(-4)}`;
}

export const inputMediator = (s: string) => {
    return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '');
};

export const determineRatingColor = (s: string) => {
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
};

export type AvailableChains =
    | 'bitcoin'
    | 'ethereum'
    | 'bitcoin'
    | 'avalanche'
    | 'polygon'
    | 'arbitrum'
    | 'optimism'
    | 'zcash';

export type AvailableCoins =
    | 'usdc'
    | 'renbtc'
    | 'btc'
    | 'wbtc'
    | 'usdt'
    | 'eth'
    | 'matic'
    | 'avax'
    | 'zec'
    | 'ibbtc';

export const truncate = (str: string, show = 6) => {
    if (str && str.length > 20) {
        const first = str.substring(0, show);
        const last = str.substring(str.length - show, str.length);
        return `${first}...${last}`;
    }
    return str || '';
};

export const calculateTimeDiff = (date: Date) => {
    const now = new Date().valueOf();
    let timeDiffMs = now - date.valueOf(); // MS
    timeDiffMs /= 1000; // Strip the MS

    const timeDiffSec = Math.round(timeDiffMs); // Seconds
    const timeDiffMin = Math.round(timeDiffSec / 60); // Minutes
    const timeDiffH = timeDiffMin / 60; // Hours

    return {
        seconds: timeDiffSec,
        minutes: timeDiffMin,
        hours: timeDiffH,
    };
};

export const renderAsset = (asset: AvailableChains | AvailableCoins | string) => {
    let formatted;

    if (asset?.length > 4 && asset?.toLowerCase() !== 'renbtc') {
        switch (asset.toLowerCase()) {
            case 'polygon':
                formatted = 'matic';
                break;
            case 'avalanche':
                formatted = 'avax';
                break;
            case 'bitcoin':
                formatted = 'btc';
                break;
            case 'arbitrum':
                formatted = 'arb';
                break;
            case 'zcash':
            case 'renzec':
                formatted = 'zec';
                break;
            default:
                formatted = 'eth';
                break;
        }
    } else {
        formatted = asset?.toLowerCase();
    }

    return `/assets/svg-coins/${formatted}.svg`;
};

export const redirectChainExplorer = (
    chain: AvailableChains | 'renvm',
    hash: string | any,
    type: 'address' | 'tx' = 'tx',
) => {
    let explorerUrl = '';
    switch (chain.toLowerCase()) {
        case 'bitcoin':
            explorerUrl = 'https://blockchair.com/search?q=';
            break;
        case 'avalanche':
            explorerUrl = `https://snowtrace.io/${type}/`;
            break;
        case 'arbitrum':
            explorerUrl = `https://arbiscan.io/${type}/`;
            break;
        case 'polygon':
            explorerUrl = `https://polygonscan.com/${type}/`;
            break;
        case 'renvm':
            explorerUrl = `https://explorer.renproject.io/${type}/`;
            break;
        default:
            explorerUrl = `https://etherscan.io/${type}/`;
            break;
    }
    return explorerUrl + (hash || '');
};

export const capFirst = (string: string | undefined) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

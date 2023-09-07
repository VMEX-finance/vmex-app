import { IMarketsAsset, ITrancheProps } from '@/api';
import { Contract, ethers } from 'ethers';
import { AVAILABLE_ASSETS, HEALTH } from './constants';
import moment from 'moment';
import { ILineChartDataPointProps } from '@/ui/components';
import { NAME_CACHE, SYMBOL_CACHE } from './cache';

const Filter = require('bad-words'),
    filter = new Filter();

export function checkProfanity(s: string) {
    return filter.isProfane(s);
}

export function truncateAddress(s: string) {
    return `${s.slice(0, 3)}...${s.slice(-4)}`;
}

export const inputMediator = (s: string) => {
    return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '');
};

export const determineRatingColor = (s: string) => {
    if (s) {
        switch (s?.toLowerCase()) {
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

export const determineCoinImg = (asset: string, custom?: string) => {
    if (custom) return custom;
    else {
        const _asset = asset.trim();
        let url = '/coins/';
        if (_asset == 'beefy') return `${url}beefy.png`;
        if (
            _asset?.toLowerCase().includes('crv') ||
            _asset?.toLowerCase().includes('curve') ||
            _asset?.toLowerCase().includes('bpt') ||
            _asset?.toLowerCase().includes('ammv2')
        ) {
            return `${url}${_asset?.toLowerCase()}.webp`;
        }
        return `${url}${_asset?.toLowerCase()}.svg`;
    }
};

export const determineCoinDescription = (asset: string, custom?: string) => {
    if (custom) return custom;
    else {
        if (asset?.toLowerCase() == 'moocurvewsteth')
            return 'Beefy vault for the wstETH/ETH curve pool';
        if (asset?.toLowerCase() == '3crv')
            return 'Curve stableswap pool between DAI, USDT, and USDC';
        if (asset?.toLowerCase() == 'susd3crv-f')
            return 'Curve stableswap pool between sUSD, DAI, USDT, and USDC';
        if (asset?.toLowerCase() == 'wstethcrv')
            return 'Curve stableswap pool between wstETH and ETH';
        if (asset?.toLowerCase().startsWith('yv')) return `Yearn vault for ${asset.substring(2)}`;
        if (asset?.toLowerCase().includes('bpt')) {
            return `Beethoven pool between ${asset.split('-')[1]} and ${asset.split('-')[2]}`;
        }
        if (asset?.toLowerCase().includes('ammv2')) {
            let stable = 'Stable';
            if (asset.startsWith('v')) {
                stable = 'Volatile';
            }
            const assets = asset.substring(7).split('/');
            return `${stable} Velodrome pool between ${assets[0]} and ${assets[1]}`;
        }

        return `Base ${asset}`;
    }
};

export const determineHealthColor = (health: number | string | undefined) => {
    if (!health) return 'text-black';
    let _health;
    if (typeof health === 'string') _health = parseFloat(health);
    else _health = health;

    if (_health > HEALTH['GREAT']) return 'text-brand-green';
    else if (_health > HEALTH['GOOD']) return 'text-green-300';
    else if (_health > HEALTH['OKAY']) return 'text-yellow-400';
    else if (_health > HEALTH['BAD']) return 'text-red-300';
    else return 'text-red-500';
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

export const convertContractsPercent = (amount: string, decimals?: number) => {
    if (!amount) return 'N/A';
    if (amount.includes('.')) return ethers.utils.formatUnits(amount.split('.')[0], decimals || 18);
    return ethers.utils.formatUnits(amount, decimals || 18);
};

export const averageOfArr = (array: number[]) =>
    array && array.length > 0 ? array.reduce((a, b) => a + b) / array.length : 0;

export const weightedAverageofArr = (nums: number[], weights: number[]) => {
    const [sum, weightSum] = weights.reduce(
        (acc, w, i) => {
            acc[0] = acc[0] + nums[i] * w;
            acc[1] = acc[1] + w;
            return acc;
        },
        [0, 0],
    );
    return sum / weightSum;
};

export const addFeaturedTranches = (
    data: ITrancheProps[] | IMarketsAsset[] | undefined,
    type: 'tranches' | 'markets',
) => {
    if (!data) return [];
    else {
        const featuredTrancheIds = ['0', '1'];
        const determinePropName = (row: any) => (type === 'tranches' ? row.id : row.trancheId);
        return data.map((el) =>
            featuredTrancheIds.includes(determinePropName(el))
                ? { ...el, featured: 'VMEX' }
                : { ...el },
        );
    }
};

export function getTimeseriesAvgByDay(
    data: { value: number; xaxis: string }[],
): { value: number; xaxis: string }[] {
    const sums = data.reduce(function (acc, obj) {
        const date = String(obj.xaxis).split(',')[0];
        if (!acc[date]) {
            acc[date] = { sum: 0, count: 0 };
        }
        acc[date].sum += +obj.value;
        acc[date].count++;
        return acc;
    }, Object.create(null));
    return Object.keys(sums).map(function (date) {
        return {
            value: sums[date].sum / sums[date].count,
            xaxis: date,
        };
    });
}

export function addMissingDatesToTimeseries(
    data: ILineChartDataPointProps[],
): ILineChartDataPointProps[] {
    const finalDataPoints: ILineChartDataPointProps[] = [];
    data.forEach(function (point, index) {
        const plotDate = moment(point.xaxis, 'MM-DD-YYYY');
        finalDataPoints.push(point);

        const nextPoint = data[index + 1];
        if (!nextPoint) {
            return;
        }

        const nextDate = moment(nextPoint.xaxis, 'MM-DD-YYYY');
        while (plotDate.add(1, 'd').isBefore(nextDate)) {
            finalDataPoints.push({
                xaxis: plotDate.toDate().toLocaleDateString(),
                value: point.value,
            });
        }
    });
    return finalDataPoints;
}

export const getRandomNumber = (number?: number) => Math.floor(Math.random() * (number || 100000));

export const capFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const findAvailableAssetProps = (asset: string, network: string) =>
    AVAILABLE_ASSETS[network].find((el) => el.symbol.toLowerCase() === asset.toLowerCase());

export const getContractMetadata = async (
    contractAddress: string,
    provider: any,
    type: 'name' | 'symbol',
) => {
    const abi = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
    ];
    const contract = new Contract(contractAddress, abi, provider);
    switch (type.toLowerCase()) {
        case 'name': {
            if (NAME_CACHE[contractAddress]) return NAME_CACHE[contractAddress];
            const name = await contract.name();
            NAME_CACHE[contractAddress] = name;
            return name;
        }
        default: {
            if (SYMBOL_CACHE[contractAddress]) return SYMBOL_CACHE[contractAddress];
            const symbol = await contract.symbol();
            SYMBOL_CACHE[contractAddress] = symbol;
            return symbol;
        }
    }
};

export function unixToDate(unix: string | number) {
    const isSeconds = String(unix).length < 12 ? true : false;
    const numberUnix = typeof unix === 'string' ? parseFloat(unix) : unix;
    return new Date(numberUnix * (isSeconds ? 1000 : 1));
}

export function sortArrByDate(arr?: any[], key = 'datetime', order?: 'asc' | 'desc') {
    if (!arr) return [];
    if (order === 'asc')
        return arr.sort((a, b) => new Date(a[key]).valueOf() - new Date(b[key]).valueOf());
    return arr.sort((a, b) => new Date(b[key]).valueOf() - new Date(a[key]).valueOf());
}

export function findInObjArr(key: string, value: string | number, arr?: any[]) {
    if (!arr) return undefined;
    return arr.find((el) => el[key] === value);
}

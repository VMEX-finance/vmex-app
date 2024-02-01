import { IMarketsAsset, INormalizedBN, ITrancheProps } from '@/api';
import { BigNumber, ethers, utils } from 'ethers';
import { HEALTH } from './constants';
import moment from 'moment';
import { ILineChartDataPointProps } from '@/ui/components';
import { getNetworkName } from './network';
import { getDecimals, toAddress } from './sdk-helpers';
import { erc20ABI, readContract } from '@wagmi/core';
import { IAddress } from '@/types/wagmi';
import { getUnderlyingMarket } from '@/store';

const Filter = require('bad-words'),
    filter = new Filter();

export function checkProfanity(s: string) {
    return filter.isProfane(s);
}

export const endsWithNumber = (text: string) => {
    return /\d$/.test(text);
};

export const removeNumberAtEnd = (text: string) => {
    return text.slice(0, text.length - 1);
};

export function truncateAddress(s: string) {
    return `${s.slice(0, 3)}...${s.slice(-4)}`;
}

export const inputMediator = (s: string) => {
    return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '');
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
    if (show !== 6 && str.length > show * 2) {
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

export const HFFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    maximumSignificantDigits: 4, //since percentages only have this many sig figs
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumSignificantDigits: 5,
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

export const toNormalizedBN = (value: BigNumber, decimals = 18): INormalizedBN => {
    if (value === BigNumber.from(0) || !value)
        return {
            raw: BigNumber.from(0),
            normalized: 0,
        };
    return {
        raw: value,
        normalized: utils.formatUnits(value, decimals),
    };
};

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

export function unixToDate(unix: string | number, trimYear?: boolean) {
    const isSeconds = String(unix).length < 12 ? true : false;
    const numberUnix = typeof unix === 'string' ? parseFloat(unix) : unix;
    const date = new Date(numberUnix * (isSeconds ? 1000 : 1));
    return date;
}

export function dateToLocale(date: Date) {
    const locale = date.toLocaleDateString();
    const [month, day, year] = locale.split('/');
    return `${month}/${day.length === 1 ? `0${day}` : day}/${year.substring(2)}`;
}

export function sortArrByDate(arr?: any[], key = 'datetime', order?: 'asc' | 'desc') {
    if (!arr) return [];
    if (order === 'asc')
        return arr.sort((a, b) => new Date(a[key]).valueOf() - new Date(b[key]).valueOf());
    return arr.sort((a, b) => new Date(b[key]).valueOf() - new Date(a[key]).valueOf());
}

export function findInObjArr(key: string, value: string | number, arr?: any[]) {
    if (!arr) return undefined;
    return arr.find((el) => String(el[key])?.toLowerCase() === String(value)?.toLowerCase());
}

export const isAddressEqual = (address1: string, address2: string) => {
    if (!address1 || !address2) return false;
    return address1.toLowerCase() === address2.toLowerCase();
};

export const formatUsdUnits = (amount: BigNumber, precion: number = 2) => {
    return `$${parseFloat(utils.formatUnits(amount, 8)).toFixed(precion)}`;
};

export const cleanNumberString = (val: string | undefined) => {
    if (!val) return '';
    return val
        .replace(/[^\d.]/g, '')
        .replaceAll(',', '')
        .replaceAll('$', '');
};

export const calculatePercentDiffBN = (initialValue: BigNumber, finalValue: BigNumber) => {
    const finalMinusInitial = finalValue.sub(initialValue);
    return finalMinusInitial.div(initialValue);
};

export const calculateRepayAmount = async (
    inputAmount?: string,
    depositedAmount?: BigNumber, // wallet balance
    borrowedAmount?: string, // amount to repay
    supplyAsset?: string,
    borrowAsset?: string,
) => {
    if (!supplyAsset || !borrowAsset) return '0';
    if (!inputAmount || !depositedAmount || !borrowedAmount) return '0';
    const network = getNetworkName();
    const supplyDecimals = await getDecimals(toAddress(supplyAsset), network);
    const nativeDepositAmount = parseFloat(utils.formatUnits(depositedAmount, supplyDecimals));
    const nativeInputAmount = parseFloat(inputAmount);
    const nativeBorrowAmount = parseFloat(borrowedAmount);
    const percent = nativeInputAmount / nativeDepositAmount;
    return (nativeBorrowAmount * percent).toString();
};
// data is messed accross the app and trancheId is sometimes string and sometimes number
export const isTrancheIdEqual = (val1: string | number, val2: string | number) => {
    const tranche1 = typeof val1 === 'string' ? parseInt(val1, 10) : val1;
    const tranche2 = typeof val2 === 'string' ? parseInt(val2, 10) : val1;

    return tranche1 === tranche2;
};

const HARDCODED_TRANCHE_NAMES: Record<string, string> = {
    '�N|�%��.��U$��D9Iyś��M���u�': 'LP asset tranche',
    '�V@�nг,� [��͔�pD}����v�9�p': 'Base assets tranche',
};

export const hardcodedTrancheNames = (name: string): string => {
    if (name in HARDCODED_TRANCHE_NAMES) {
        return HARDCODED_TRANCHE_NAMES[name];
    }
    return name;
};

export const getBalance = async (
    address: IAddress,
    user: IAddress,
    returnType: 'raw' | 'normalized' = 'raw',
    markets?: any[],
) => {
    const balance = await readContract({
        address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [user],
    });
    if (returnType === 'raw') return balance;
    if (markets) {
        const underlying = getUnderlyingMarket(address, markets);
        if (underlying) return utils.formatUnits(balance, underlying.decimals);
    }
    const network = getNetworkName();
    const decimals = await getDecimals(address, network);
    return utils.formatUnits(balance, decimals);
};

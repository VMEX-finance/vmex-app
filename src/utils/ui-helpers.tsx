import React from 'react';
import { IProtocolActions, ITransactionStatus } from '@/types/protocol';
import { GiPayMoney, GiReceiveMoney, GiClockwiseRotation, GiPadlock } from 'react-icons/gi';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { getNetworkName } from './network';
import { HEALTH } from './constants';
import { Tooltip } from '@/ui/components';
import { MdError, MdCheckBox } from 'react-icons/md';
import { IoCloseCircle } from 'react-icons/io5';
import { HiMiniEllipsisHorizontalCircle } from 'react-icons/hi2';

export const renderIcon = (txType?: IProtocolActions, size = 20) => {
    switch (txType) {
        case 'lend': {
            return (
                <Tooltip text="Supply">
                    <GiPayMoney size={size} />
                </Tooltip>
            );
        }
        case 'borrow': {
            return (
                <Tooltip text="Borrow">
                    <GiReceiveMoney size={size} />
                </Tooltip>
            );
        }
        case 'lock':
            return (
                <Tooltip text="Lock">
                    <GiPadlock size={size} />
                </Tooltip>
            );
        case 'loop':
            return (
                <Tooltip text="Loop">
                    <GiClockwiseRotation size={size} />
                </Tooltip>
            );
        default: {
            return <AiOutlineQuestionCircle size={size} />;
        }
    }
};

export const renderTxStatus = (status: ITransactionStatus, size = 20) => {
    switch (status) {
        case 'complete':
            return (
                <Tooltip text="Success">
                    <MdCheckBox size={size} className="text-green-500 dark:text-green-400" />
                </Tooltip>
            );
        case 'pending':
            return (
                <Tooltip text="Pending">
                    <HiMiniEllipsisHorizontalCircle size={size} className="text-yellow-400" />
                </Tooltip>
            );
        default:
            return (
                <Tooltip text="Error">
                    <MdError size={size} className="text-red-600 dark:text-red-400" />
                </Tooltip>
            );
    }
};

export const renderTrancheActivity = (status: string) => {
    const size = '20px';
    if (status) {
        switch (status?.toLowerCase()) {
            case 'loading':
                return (
                    <div className="flex gap-2 animate-pulse">
                        <GiPayMoney size={size} />
                        <GiReceiveMoney size={size} />
                    </div>
                );
            case 'supplied':
                return (
                    <Tooltip text="Supplying">
                        <GiPayMoney size={size} />
                    </Tooltip>
                );
            case 'borrowed':
                return (
                    <Tooltip text="Borrowing">
                        <GiReceiveMoney size={size} />
                    </Tooltip>
                );
            case 'both':
                return (
                    <div className="flex gap-2">
                        <Tooltip text="Supplying">
                            <GiPayMoney size={size} />
                        </Tooltip>
                        <Tooltip text="Borrowing">
                            <GiReceiveMoney size={size} />
                        </Tooltip>
                    </div>
                );
            default:
                return <></>;
        }
    }
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
        const _asset = asset.trim().toLowerCase();
        let url = '/coins/';
        if (_asset === 'velo') return `${url}0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db.svg`;
        if (_asset == 'beefy') return `${url}beefy.png`;
        if (_asset?.includes('bpt')) return `${url}${_asset}.png`;
        if (
            (_asset?.includes('crv') && _asset !== 'crv') ||
            _asset?.includes('curve') ||
            _asset?.includes('ammv2') ||
            _asset === 'grail'
        ) {
            return `${url}${_asset}.webp`;
        }
        if (_asset === 'bibta') return `${url}bibta.webp`;
        if (_asset === 'bib01') return `${url}bib01.png`;
        if (_asset === 'vmex') return `${url}vmex.png`;
        return `${url}${_asset}.svg`;
    }
};

export const determineCoinDescription = (asset: string, custom?: string) => {
    if (custom) return custom;
    else {
        const network = getNetworkName();
        if (asset?.toLowerCase() == 'moocurvewsteth')
            return 'Beefy vault for the wstETH/ETH curve pool';
        if (asset?.toLowerCase() == '2crv') return 'Curve stableswap pool between USDT and USDC';
        if (asset?.toLowerCase() == '3crv')
            return 'Curve stableswap pool between DAI, USDT, and USDC';
        if (asset?.toLowerCase() == 'fraxbpcrv-f')
            return 'Curve stableswap pool between FRAX and USDC.e';
        if (asset?.toLowerCase() == 'susd3crv-f')
            return 'Curve stableswap pool between sUSD, DAI, USDT, and USDC';
        if (asset?.toLowerCase() == 'wstethcrv')
            return 'Curve stableswap pool between wstETH and ETH';
        if (asset?.toLowerCase().startsWith('yv')) return `Yearn vault for ${asset.substring(2)}`;
        if (asset?.toLowerCase().includes('bpt')) {
            if (network == 'optimism') {
                return `Beethoven pool between ${asset.split('-')[1]} and ${asset.split('-')[2]}`;
            } else {
                return `Balancer pool between ${asset.split('-')[0]} and ${asset.split('-')[1]}`;
            }
        }
        if (asset?.toLowerCase().includes('amm')) {
            let stable = 'Stable';
            if (asset.startsWith('v')) {
                stable = 'Volatile';
            }
            if (network == 'base') {
                const assets = asset.substring(5).split('/');
                return `${stable} Aerodrome pool between ${assets[0]} and ${assets[1]}`;
            } else {
                const assets = asset.substring(7).split('/');
                return `${stable} Velodrome pool between ${assets[0]} and ${assets[1]}`;
            }
        }
        if (asset?.toLowerCase().startsWith('cmlt')) {
            const assets = asset.substring(5).split('-');
            return `Camelot pool between ${assets[0]} and ${assets[1]}`;
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
    else return 'text-red-500 dark:text-red-400';
};

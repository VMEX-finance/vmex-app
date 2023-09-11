import { determineCoinImg, numberFormatter, usdFormatter } from '@/utils';
import React from 'react';

type IPillDisplayProps = {
    asset: string;
    value?: string | number;
    type?: 'asset' | 'basic';
    formatter?: 'usd' | 'basic' | 'none';
};

export const PillDisplay = ({ asset, value, type, formatter = 'usd' }: IPillDisplayProps) => {
    const determineFormat = (val: number | string) => {
        if (typeof val === 'string') {
            return val;
        }
        switch (formatter) {
            case 'usd':
                return usdFormatter().format(val);
            case 'basic':
                return numberFormatter.format(val);
            default:
                return val;
        }
    };

    if (type === 'asset') {
        return (
            <div className="bg-neutral-300 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-3xl flex items-center gap-4 w-fit px-3 py-1">
                <div className="flex gap-1">
                    <img src={determineCoinImg(asset)} alt={asset} height="24" width="24" />
                    <span className="text-lg whitespace-nowrap truncate">{asset}</span>
                </div>
                {value && <span className="text-lg">{determineFormat(value)}</span>}
            </div>
        );
    } else {
        return (
            <div className="bg-transparent border border-neutral-100 rounded-3xl flex items-center gap-3 w-fit px-5 py-1">
                <span className="text-xl">{asset || 'ETH'}</span>
                {value && <span className="text-lg">{determineFormat(value) || 0}</span>}
            </div>
        );
    }
};

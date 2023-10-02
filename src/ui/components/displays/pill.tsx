import { determineCoinImg, numberFormatter, usdFormatter } from '@/utils';
import React from 'react';
import { AssetDisplay } from './asset';

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
            <div className="bg-neutral-300 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-3xl flex items-center gap-4 w-fit pl-1.5 pr-2 2xl:pl-2 2xl:pr-2.5 py-0.5 2xl:py-1">
                <div className="flex gap-1">
                    <AssetDisplay name={asset} size="pill" noText />
                    <span className="2xl:text-lg whitespace-nowrap truncate max-w-[100px]">
                        {asset}
                    </span>
                </div>
                {value && <span className="text-lg">{determineFormat(value)}</span>}
            </div>
        );
    } else {
        return (
            <div className="bg-transparent border border-neutral-100 rounded-full flex items-center gap-3 w-fit px-3 2xl:px-4 py-0.5 lg:py-1">
                <span className="text-xl">{asset || 'ETH'}</span>
                {value && <span className="text-lg">{determineFormat(value) || 0}</span>}
            </div>
        );
    }
};

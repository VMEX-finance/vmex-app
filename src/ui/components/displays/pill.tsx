import { numberFormatter, usdFormatter } from '../../../utils/helpers';
import React from 'react';

type IPillDisplayProps = {
    asset: string;
    value: string | number;
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
            <div className="bg-neutral-900 text-white rounded-3xl flex items-center gap-4 w-fit px-3 py-1">
                <div className="flex gap-1">
                    <img
                        src={`/coins/${asset.toLowerCase()}.svg`}
                        alt={asset}
                        height="24"
                        width="24"
                    />
                    <span className="text-lg">{asset}</span>
                </div>
                <span className="text-lg">{determineFormat(value)}</span>
            </div>
        );
    } else {
        return (
            <div className="bg-transparent border border-neutral-100 rounded-3xl flex items-center gap-3 w-fit px-5 py-1">
                <span className="text-xl">{asset || 'ETH'}</span>
                <span className="text-lg">{determineFormat(value) || 0}</span>
            </div>
        );
    }
};

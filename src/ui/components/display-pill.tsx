import { truncate as _truncate, numberFormatter, usdFormatter } from '@/utils';
import React, { ReactNode } from 'react';
import { AssetDisplay } from './display-asset';
import { useWindowSize } from '@/hooks';

type IPillDisplayProps = {
    asset: string;
    value?: string | number | ReactNode;
    type?: 'asset' | 'basic';
    formatter?: 'usd' | 'basic' | 'none';
    size?: 'sm' | 'md';
    hoverable?: boolean;
    selected?: boolean;
    truncate?: boolean;
};

export const PillDisplay = ({
    asset,
    value,
    type,
    formatter = 'usd',
    size = 'md',
    hoverable,
    selected,
    truncate,
}: IPillDisplayProps) => {
    const { width, breakpoints } = useWindowSize();
    const determineFormat = (val: number | string | ReactNode) => {
        if (typeof val !== 'string' && typeof val !== 'number') return val;
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

    const determineSize = () => {
        switch (size) {
            case 'sm':
                return ['text-md', ''];
            default:
                return ['', ''];
        }
    };

    if (type === 'asset') {
        return (
            <div
                className={`transition duration-150 bg-neutral-300 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-3xl flex items-center gap-4 w-fit pl-1.5 pr-2 py-1 ${
                    determineSize()[1]
                } ${hoverable ? 'hover:bg-[rgb(200,200,200)] dark:hover:bg-neutral-700' : ''} ${
                    selected
                        ? '!bg-[rgb(200,200,200)] outline outline-2 outline-brand-purple dark:!bg-neutral-700'
                        : ''
                }`}
            >
                <div className="flex items-center gap-1">
                    <AssetDisplay name={asset} size="pill" noText />
                    <span
                        className={`whitespace-nowrap truncate max-w-[100px] ${determineSize()[0]}`}
                    >
                        {asset}
                    </span>
                </div>
                {value && <span className="">{determineFormat(value)}</span>}
            </div>
        );
    } else {
        return (
            <div className="bg-transparent border border-neutral-100 rounded-full flex items-center gap-3 w-fit px-3 2xl:px-4 py-0.5 lg:py-1">
                <span className="text-xl">
                    {truncate && width < breakpoints.sm ? _truncate(asset, 5) : asset || 'ETH'}
                </span>
                {value && <span className="text-lg">{determineFormat(value) || 0}</span>}
            </div>
        );
    }
};

import React from 'react';
import { AssetDisplay } from './display-asset';
import { SmartPrice } from './smart-price';

type IAvailableAssetDisplayProps = {
    asset: string;
    amount?: string | number;
    balance?: string | number;
    selectable?: boolean;
    background?: boolean;
    selected?: boolean;
    setSelected?: any;
};

export const AvailableAssetDisplay = ({
    asset,
    amount,
    balance,
    selectable,
    selected,
    setSelected,
    background = true,
}: IAvailableAssetDisplayProps) => {
    return (
        <div
            className={`
        transition duration-100
        flex justify-between items-center 
        p-2 border-4
        ${background ? 'rounded-lg bg-neutral-200' : ''}
        ${selectable ? 'hover:bg-neutral-300 cursor-pointer' : ''}
        ${selected ? 'border-brand-purple bg-neutral-300' : ''}
      `}
            onClick={setSelected ? setSelected : () => {}}
        >
            <AssetDisplay name={asset} logo={`/coins/${asset?.toLowerCase()}.svg`} />
            <div className="flex flex-col text-right">
                <span className="text-neutral-600 text-sm">
                    {amount || 0} {asset.toUpperCase()}
                </span>
                <span className="text-blue-700 text-sm">
                    Balance: {<SmartPrice price={String(balance) || '0'} />}
                </span>
            </div>
        </div>
    );
};

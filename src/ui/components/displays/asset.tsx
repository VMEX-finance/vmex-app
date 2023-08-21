import { determineCoinImg } from '../../../utils/helpers';
import React from 'react';
import { MultipleAssetsDisplayOverlapping } from './multi-asset';

type IAssetDisplayProps = {
    logo?: string;
    name: string;
    className?: string;
    size?: 'lg' | 'md' | 'sm';
    value?: string;
    border?: boolean;
};

export const AssetDisplay = (props: IAssetDisplayProps) => {
    const iconSize = () => {
        switch (props.size) {
            case 'lg':
                return 'h-10 w-10';
            case 'sm':
                return 'h-8 w-8';
            default:
                return 'h-8 w-8';
        }
    };

    return (
        <div
            className={`flex items-center gap-1 rounded-lg w-max ${
                props.className ? props.className : ''
            } ${props.border ? 'border border-1 border-brand-black w-fit px-2' : ''}`}
        >
            {renderAsset(props.name, iconSize())}
            <span>{props.name}</span>
            {props.value && <span>{props.value}</span>}
        </div>
    );
};

export const renderAsset = (
    asset: string,
    size?: string,
    i?: number,
    custom?: string,
    key?: string,
) => {
    return asset.includes('moo') ? (
        MultipleAssetsDisplayOverlapping({
            assets: [asset.substring(3), 'beefy'],
        })
    ) : asset.substring(0, 2) == 'yv' ? (
        MultipleAssetsDisplayOverlapping({
            assets: [asset.substring(2), 'yearn'],
        })
    ) : (
        <img
            key={`render-asset-${key || i || asset}`}
            src={determineCoinImg(asset, custom)}
            alt={asset}
            className={`${size ? size : 'h-8 w-8'}`}
        />
    );
};

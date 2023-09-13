import { determineCoinDescription, determineCoinImg, getRandomNumber } from '@/utils';
import React from 'react';
import { MultipleAssetsDisplayOverlapping } from './multi-asset';
import { Tooltip } from '../tooltips';

type IAssetDisplayProps = {
    logo?: string;
    name: string;
    className?: string;
    size?: 'lg' | 'md' | 'sm';
    value?: string;
    border?: boolean;
    noText?: boolean;
};

export const AssetDisplay = (props: IAssetDisplayProps) => {
    return (
        <div
            className={`flex items-center gap-1 rounded-lg w-max ${
                props.className ? props.className : ''
            } ${props.border ? 'border border-1 border-brand-black w-fit px-2' : ''}`}
        >
            {renderAsset(props.name, props.size)}
            {!props.noText && <span>{props.name}</span>}
            {props.value && <span>{props.value}</span>}
        </div>
    );
};

export const renderAsset = (
    asset: string,
    size?: 'lg' | 'md' | 'sm',
    i?: number,
    custom?: string,
    key?: string,
) => {
    if (asset.includes('BPT')) console.log('asset', asset);
    return asset.includes('moo') ? (
        MultipleAssetsDisplayOverlapping({
            assets: [asset.substring(3), 'beefy'],
            size,
            origAssetName: asset,
        })
    ) : asset.substring(0, 2) == 'yv' ? (
        MultipleAssetsDisplayOverlapping({
            assets: [asset.substring(2), 'yearn'],
            size,
            origAssetName: asset,
        })
    ) : asset.substring(0, 5) == 'vAMM-' ? ( // may be velo in base
        MultipleAssetsDisplayOverlapping({
            assets: [asset.split('/')[0].substring(5), 'aero'],
            size,
            origAssetName: asset,
        })
    ) : (
        <Tooltip
            text={determineCoinDescription(asset)}
            key={`tooltip-render-asset-${key || i || asset}-${getRandomNumber()}`}
        >
            <img
                src={determineCoinImg(asset, custom)}
                className={`${size ? iconSizeClass(size) : 'h-8 w-8'}`}
                alt={asset}
                key={`render-asset-${key || i || asset}-${getRandomNumber()}`}
            />
        </Tooltip>
    );
};

export const iconSize = (size?: 'lg' | 'md' | 'sm') => {
    switch (size) {
        case 'lg':
            return '40';
        case 'sm':
            return '20';
        default:
            return '30';
    }
};
export const smallerIconSize = (size?: 'lg' | 'md' | 'sm') => {
    switch (size) {
        case 'lg':
            return 'h-4 w-4';
        case 'sm':
            return 'h-2 w-2';
        default:
            return 'h-3 w-3';
    }
};

export const iconSizeClass = (size?: 'lg' | 'md' | 'sm') => {
    switch (size) {
        case 'lg':
            return 'h-8 w-8';
        case 'sm':
            return 'h-4 w-4';
        default:
            return 'h-6 w-6';
    }
};

export const marginLeft = (size?: 'lg' | 'md' | 'sm') => {
    switch (size) {
        case 'lg':
            return '-1.5rem';
        case 'sm':
            return '-1rem';
        default:
            return '-1.2rem';
    }
};

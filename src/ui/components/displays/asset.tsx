import { determineCoinDescription, determineCoinImg, getRandomNumber } from '@/utils';
import React from 'react';
import { MultipleAssetsDisplayOverlapping } from './multi-asset';
import { Tooltip } from '../tooltips';

type IAssetDisplayProps = {
    logo?: string;
    name: string;
    className?: string;
    size?: 'lg' | 'md' | 'sm' | 'pill';
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
    size?: 'lg' | 'md' | 'sm' | 'pill',
    i?: number,
    custom?: string,
    key?: string,
) => {
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
    ) : asset.substring(0, 5).toUpperCase() == 'VAMM-' ? ( // may be velo in base
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
                className={`${size ? iconSizeClass(size) : 'h-7 2xl:h-8 w-7 2xl:w-8'}`}
                alt={asset}
                key={`render-asset-${key || i || asset}-${getRandomNumber()}`}
            />
        </Tooltip>
    );
};

export const iconSize = (size?: 'lg' | 'md' | 'sm' | 'pill') => {
    switch (size) {
        case 'lg':
            return '36';
        case 'pill':
            return '24';
        case 'sm':
            return '18';
        default:
            return '28';
    }
};
export const smallerIconSize = (size?: 'lg' | 'md' | 'sm' | 'pill') => {
    switch (size) {
        case 'lg':
            return 'h-4 w-4';
        case 'sm':
            return 'h-2 w-2';
        default:
            return 'h-3 w-3';
    }
};

export const iconSizeClass = (size?: 'lg' | 'md' | 'sm' | 'pill') => {
    switch (size) {
        case 'lg':
            return 'h-7 2xl:h-8 w-7 2xl:w-8';
        case 'sm':
            return 'h-4 w-4';
        default:
            return 'h-6 w-6';
    }
};

export const marginLeft = (size?: 'lg' | 'md' | 'sm' | 'pill') => {
    switch (size) {
        case 'lg':
            return '-1.5rem';
        case 'pill':
            return '-1rem';
        case 'sm':
            return '-1rem';
        default:
            return '-1.2rem';
    }
};

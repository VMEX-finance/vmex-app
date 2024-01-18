import {
    determineCoinDescription,
    determineCoinImg,
    endsWithNumber,
    getRandomNumber,
} from '@/utils';
import React from 'react';
import { Tooltip } from './tooltip-default';
import { MultipleAssetsDisplayOverlapping } from './display-multi-asset';
import { IAssetSize } from '@/types/size';

type IAssetDisplayProps = {
    logo?: string;
    name: string;
    className?: string;
    size?: IAssetSize;
    value?: string;
    border?: boolean;
    noText?: boolean;
};

const AssetDisplay = React.memo((props: IAssetDisplayProps) => {
    const renderSize = () => {
        switch (props.size) {
            case 'xl':
                return { img: '48', text: 'text-xl ml-1' };
            case 'sm':
                return { img: '24', text: 'text-md' };
            default:
                return { img: '36', text: 'text-md' };
        }
    };
    return (
        <div
            className={`flex items-center gap-1 rounded-lg w-max ${
                props.className ? props.className : ''
            } ${props.border ? 'border border-1 border-brand-black w-fit px-2' : ''}`}
        >
            {props?.logo && props?.name ? (
                <>
                    <img
                        src={props.logo}
                        alt={props.name}
                        height={renderSize().img}
                        width={renderSize().img}
                    />
                    {!props.noText && (
                        <span className={`${renderSize().text} truncate whitespace-nowrap`}>
                            {props.name || ''}
                        </span>
                    )}
                </>
            ) : (
                <>
                    {!props?.name?.includes('Underlying') &&
                        renderAsset(props.name || '', props.size)}
                    {!props.noText && (
                        <span className={`truncate whitespace-nowrap ${renderSize().text}`}>
                            {props.name || ''}
                        </span>
                    )}
                    {props.value && <span>{props.value}</span>}
                </>
            )}
        </div>
    );
});

AssetDisplay.displayName = 'AssetDisplay';
export { AssetDisplay };

export const renderAsset = (
    asset: string,
    size?: IAssetSize,
    i?: number,
    custom?: string,
    key?: string,
) => {
    console.log('renderAsset', asset, size, i, custom, key);
    return asset?.includes('moo') ? (
        MultipleAssetsDisplayOverlapping({
            assets: [asset?.substring(3), 'beefy'],
            size,
            origAssetName: asset,
        })
    ) : asset?.substring(0, 2) === 'yv' ? (
        asset?.includes('AMMV2') ? (
            MultipleAssetsDisplayOverlapping({
                assets: [...asset.substring(10).split('/'), 'yearn'],
                size,
                origAssetName: asset.substring(1),
            })
        ) : (
            MultipleAssetsDisplayOverlapping({
                assets: [asset.substring(2), 'yearn'],
                size,
                origAssetName: asset,
            })
        )
    ) : asset?.substring(1, 5).toUpperCase() == 'AMM-' ? ( // aero in base
        MultipleAssetsDisplayOverlapping({
            assets: [asset?.split('/')[0].substring(5), 'aero'],
            size,
            origAssetName: asset,
        })
    ) : asset?.toUpperCase().startsWith('CMLT-') ? ( // cmlt
        MultipleAssetsDisplayOverlapping({
            assets: [asset?.substring(5).split('-')[0], 'grail'],
            size,
            origAssetName: asset,
        })
    ) : asset?.toUpperCase().endsWith('-BPT') ? ( // balancer
        MultipleAssetsDisplayOverlapping({
            assets: [asset?.split('-')[0], 'bal'],
            size,
            origAssetName: asset,
        })
    ) : asset?.toUpperCase() == 'FRAXBPCRV-F' ? (
        MultipleAssetsDisplayOverlapping({
            assets: ['frax', 'crv'],
            size,
            origAssetName: asset,
        })
    ) : asset?.substring(0, 4) === 'vG-v' ? (
        MultipleAssetsDisplayOverlapping({
            assets: ['vmex', asset.substring(4).replace(/[0-9]/g, '')],
            size,
            origAssetName: asset,
        })
    ) : asset?.startsWith('v') && endsWithNumber(asset) ? (
        MultipleAssetsDisplayOverlapping({
            assets: ['vmex', asset?.substring(1)?.replace(/[0-9]/g, '')],
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

export const iconSize = (size?: IAssetSize) => {
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
export const smallerIconSize = (size?: IAssetSize) => {
    switch (size) {
        case 'xl':
            return 'h-5 w-5';
        case 'lg':
            return 'h-4 w-4';
        case 'sm':
            return 'h-2 w-2';
        default:
            return 'h-3 w-3';
    }
};

export const iconSizeClass = (size?: IAssetSize) => {
    switch (size) {
        case 'xl':
            return 'h-10 w-10';
        case 'lg':
            return 'h-7 2xl:h-8 w-7 2xl:w-8';
        case 'sm':
            return 'h-4 w-4';
        default:
            return 'h-6 w-6';
    }
};

export const addMargin = (size?: IAssetSize) => {
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

import { determineCoinImg } from '../../../utils/helpers';
import React from 'react';

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
                return '40';
            case 'sm':
                return '20';
            default:
                return '30';
        }
    };

    return (
        <div
            className={`flex items-center gap-1 rounded-lg w-max ${
                props.className ? props.className : ''
            } ${props.border ? 'border border-1 border-brand-black w-fit px-2' : ''}`}
        >
            <img
                src={determineCoinImg(props.name, props.logo)}
                alt={props.name}
                height={iconSize()}
                width={iconSize()}
            />
            <span>{props.name?.toUpperCase()}</span>
            {props.value && <span>{props.value}</span>}
        </div>
    );
};

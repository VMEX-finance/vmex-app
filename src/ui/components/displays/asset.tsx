import { useWindowSize } from '../../../hooks/ui';
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
    const { width } = useWindowSize();
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
            className={`flex items-center gap-1 rounded-lg ${
                props.className ? props.className : ''
            } ${props.border ? 'border border-1 border-black w-fit px-2' : ''}`}
        >
            <img
                src={props.logo ? props.logo : `/coins/${props.name?.toLowerCase()}.svg`}
                alt={props.name}
                height={iconSize()}
                width={iconSize()}
            />
            <span>{props.name?.toUpperCase()}</span>
            {props.value && <span>{props.value}</span>}
        </div>
    );
};

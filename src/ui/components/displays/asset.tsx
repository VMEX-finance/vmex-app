import React from 'react';

type IAssetDisplayProps = {
    logo?: string;
    name: string;
    className?: string;
    size?: 'lg' | 'md' | 'sm';
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
        <div className={`flex items-center gap-1 ${props.className ? props.className : ''}`}>
            <img
                src={props.logo ? props.logo : `/tokens/token-${props.name?.toUpperCase()}.svg`}
                alt={props.name}
                height={iconSize()}
                width={iconSize()}
            />
            {props.name?.toUpperCase()}
        </div>
    );
};

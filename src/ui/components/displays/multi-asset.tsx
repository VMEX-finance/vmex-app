import React from 'react';
import { Tooltip } from '../tooltips';

interface IMultipleAssetsProps {
    assets?: string[];
    show?: number | 'all';
    size?: string;
}

export const MultipleAssetsDisplay = ({ assets, show = 4, size }: IMultipleAssetsProps) => {
    const mapAssets = () => {
        if (assets) {
            if (show === 'all') return assets;
            else return assets.slice(0, show ? show : 4);
        } else {
            return [];
        }
    };

    return (
        <div className={`flex flex-wrap items-center ${show === 'all' ? 'gap-3' : 'xl:gap-2'}`}>
            {mapAssets().map((el, i) => (
                <img
                    key={`tranches-asset-${i}`}
                    src={`/coins/${el.toLowerCase()}.svg`}
                    alt={el}
                    className={`${size ? size : 'h-8 w-8'}`}
                />
            ))}
            {show !== 'all' && assets && assets.length > (show ? show : 4) && (
                <Tooltip
                    text={assets.slice(show ? show : 4).join(', ')}
                    content={
                        <span className="ml-1 md:ml-2">
                            +{assets.slice(show ? show : 4).length}
                        </span>
                    }
                />
            )}
        </div>
    );
};

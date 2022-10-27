import { useWindowSize } from '../../../hooks/ui';
import React from 'react';

interface IMultipleAssetsProps {
    assets?: string[];
    show?: number | 'all';
}

export const MultipleAssetsDisplay = ({ assets, show = 4 }: IMultipleAssetsProps) => {
    const { width } = useWindowSize();

    const mapAssets = () => {
        if (assets) {
            if (show === 'all') return assets;
            else return assets.slice(0, width > 1000 ? show : 2);
        } else {
            return [];
        }
    };

    return (
        <div className={`flex items-center ${show === 'all' ? 'gap-2' : 'xl:gap-2'}`}>
            {/* TODO: make assets overlap each other ever so slightly */}
            {mapAssets().map((el, i) => (
                <img
                    key={`tranches-asset-${i}`}
                    src={`/tokens/token-${el}.svg`}
                    alt={el}
                    className="h-8 w-8"
                />
            ))}
            {show !== 'all' && (
                <span className="ml-1 md:ml-2">
                    +{assets ? assets.slice(width > 1000 ? show : 2).length : 0}
                </span>
            )}
        </div>
    );
};

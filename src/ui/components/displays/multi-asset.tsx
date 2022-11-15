import { useWindowSize } from '../../../hooks/ui';
import React from 'react';
import { Tooltip } from '../tooltips';

interface IMultipleAssetsProps {
    assets?: string[];
    show?: number | 'all';
    size?: string;
}

export const MultipleAssetsDisplay = ({ assets, show = 4, size }: IMultipleAssetsProps) => {
    const { width } = useWindowSize();

    const mapAssets = () => {
        if (assets) {
            if (show === 'all') return assets;
            else return assets.slice(0, show ? show : 4);
        } else {
            return [];
        }
    };

    const fallbackImg = (asset: string) => {
        if (asset === 'triCrypto2') return 'CRV';
        else return asset;
    };

    return (
        <div className={`flex flex-wrap items-center ${show === 'all' ? 'gap-3' : 'xl:gap-2'}`}>
            {/* TODO: make assets overlap each other ever so slightly */}
            {mapAssets().map((el, i) => (
                <img
                    key={`tranches-asset-${i}`}
                    src={`/tokens/token-${fallbackImg(el)}.svg`}
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

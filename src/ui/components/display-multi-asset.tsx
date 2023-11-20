import { determineCoinDescription, determineCoinImg, getRandomNumber } from '@/utils';
import React from 'react';
import { Loader } from './loader';
import { Tooltip } from './tooltip-default';
import { renderAsset, smallerIconSize, iconSizeClass, marginLeft } from './display-asset';

interface IMultipleAssetsProps {
    assets?: string[];
    show?: number | 'all';
    size?: 'lg' | 'md' | 'sm' | 'pill';
    loading?: boolean;
    gap?: string;
    origAssetName?: string;
}

export const MultipleAssetsDisplay = ({ assets, show = 4, size, gap }: IMultipleAssetsProps) => {
    const mapAssets = () => {
        if (assets) {
            if (show === 'all') return assets;
            else return assets.slice(0, show ? show : 4);
        } else {
            return [];
        }
    };

    const determineMargin = () => {
        switch (size) {
            case 'lg':
                return 'ml-1.5 md:ml-2.5';
            case 'md':
                return 'ml-1 md:ml-2';
            default:
                return 'ml-0.5 lg:ml-1';
        }
    };

    return (
        <div
            className={`flex flex-wrap items-center ${
                gap ? gap : `${show === 'all' ? 'gap-3' : 'gap-1 2xl:gap-1.5'}`
            }`}
            key={`multiple-assets-display-${getRandomNumber()}`}
        >
            {mapAssets().length !== 0
                ? mapAssets().map((el, i) =>
                      renderAsset(
                          el,
                          size,
                          0,
                          undefined,
                          `tranches-asset-${i}-${getRandomNumber()}`,
                      ),
                  )
                : [1, 2, 3, 4].map((el) => (
                      <Loader
                          key={`${el}-${getRandomNumber()}`}
                          className={`${
                              size ? iconSizeClass(size) : '!h-7 2xl:!h-8 !w-7 2xl:!w-8'
                          }`}
                          variant="circular"
                      />
                  ))}
            {show !== 'all' && assets && assets.length > (show ? show : 4) && (
                <Tooltip
                    text={assets.slice(show ? show : 4).join(', ')}
                    key={`tooltip-multi-asset-display-${getRandomNumber()}`}
                >
                    <span className={`${determineMargin()}`}>
                        +{assets.slice(show ? show : 4).length}
                    </span>
                </Tooltip>
            )}
        </div>
    );
};

export const MultipleAssetsDisplayOverlapping = ({
    assets,
    size,
    gap,
    origAssetName,
}: IMultipleAssetsProps) => {
    return (
        <Tooltip
            text={determineCoinDescription(origAssetName || '')}
            key={`tooltip-multiple-assets-overlap-${getRandomNumber()}`}
        >
            <div
                className={`flex ${gap ? gap : 'gap-2'}`}
                style={{ flexWrap: 'wrap', position: 'relative' }} // Added style for wrapping
            >
                {assets?.length !== 0 ? (
                    assets?.map((el, i) =>
                        i == assets?.length - 1 ? (
                            <img
                                key={`tranches-asset-${i}-${getRandomNumber()}`}
                                src={determineCoinImg(el)}
                                alt={el}
                                className={`${
                                    size ? smallerIconSize(size) : 'h-4 w-4'
                                } absolute top-0 right-0`}
                                style={{
                                    position: 'relative',
                                    zIndex: i, // Increase zIndex for overlapping effect
                                    marginLeft: i > 0 ? marginLeft(size) : 0, // Overlapping margin
                                }}
                            />
                        ) : (
                            <img
                                key={`tranches-asset-${i}-${getRandomNumber()}`}
                                src={determineCoinImg(el)}
                                alt={el}
                                className={`${size ? iconSizeClass(size) : 'h-7 w-7'}`}
                                style={{
                                    position: 'relative',
                                    zIndex: i, // Increase zIndex for overlapping effect
                                    marginLeft: i > 0 ? marginLeft(size) : 0, // Overlapping margin
                                }}
                            />
                        ),
                    )
                ) : (
                    <Loader
                        variant="circular"
                        className={`${size ? iconSizeClass(size) : 'h-7 w-7'}`}
                        key={`skeleton-loader-multiple-assets-${getRandomNumber()}`}
                    />
                )}
            </div>
        </Tooltip>
    );
};

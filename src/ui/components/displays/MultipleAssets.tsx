import React from 'react';

interface IMultipleAssetsProps {
    assets?: string[];
}

export const MultipleAssetsDisplay = ({ assets }: IMultipleAssetsProps) => {
    return (
        <div className="flex items-center">
            {/* TODO: make assets overlap each other ever so slightly */}
            {assets &&
                assets
                    .slice(0, 4)
                    .map((el, i) => (
                        <img
                            key={`tranches-asset-${i}`}
                            src={`/tokens/token-${el}.svg`}
                            alt={el}
                            className="h-8 w-8"
                        />
                    ))}
            <span className="ml-2">+{assets ? assets.slice(4).length : 0}</span>
        </div>
    );
};

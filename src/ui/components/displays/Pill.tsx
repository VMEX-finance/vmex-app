import React from 'react';

type IPillDisplay = {
    asset: string;
    value: string | number;
    type?: 'asset' | 'basic';
};

export const PillDisplay = (props: IPillDisplay) => {
    if (props.type === 'asset') {
        return (
            <div className="bg-black text-white rounded-3xl flex items-center gap-5 w-fit px-3 py-1">
                <div className="flex gap-1">
                    <img
                        src={`/tokens/token-${props.asset.toUpperCase()}.svg`}
                        alt={props.asset}
                        height="24"
                        width="24"
                    />
                    <span className="text-lg">{props.asset}</span>
                </div>
                <span className="text-lg">{props.value}</span>
            </div>
        );
    } else {
        return (
            <div className="bg-transparent border border-neutral-100 rounded-3xl flex items-center gap-3 w-fit px-5 py-1">
                <span className="text-2xl">{props.asset || 'ETH'}</span>
                <span className="text-xl">{props.value || 0}</span>
            </div>
        );
    }
};

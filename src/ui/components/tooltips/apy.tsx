import React from 'react';
import { useApyData } from '@/api';
import { findInObjArr, percentFormatter } from '@/utils';
import { Tooltip } from './default';

export const ApyToolitp = ({ symbol, oldApy }: { symbol?: string; oldApy?: number | string }) => {
    const { queryAssetApys } = useApyData();

    if (!symbol) return <span>{percentFormatter.format(Number(oldApy || 0))}</span>;

    const rewardApy = findInObjArr('symbol', symbol, queryAssetApys.data);
    if (rewardApy) {
        const { apysByToken, asset, assetType, name, symbol, totalApy } = rewardApy;
        const percent = percentFormatter.format(Number(totalApy) / 100);
        if (apysByToken?.length) {
            return (
                <Tooltip id={asset} content={percent}>
                    <div className="min-w-[120px]">
                        <span className="font-bold">APY Breakdown</span>
                        {apysByToken.map((x: any) => (
                            <div
                                className="text-sm flex justify-between items-center gap-6"
                                key={`reward-apy-tooltip-${x.asset}`}
                            >
                                <span>{x?.symbol || x.asset}</span>
                                <span>{percentFormatter.format(Number(x.apy) / 100)}</span>
                            </div>
                        ))}
                    </div>
                </Tooltip>
            );
        }
        return <span>{percent}</span>;
    }
    return <span>{percentFormatter.format(Number(oldApy || 0))}</span>;
};

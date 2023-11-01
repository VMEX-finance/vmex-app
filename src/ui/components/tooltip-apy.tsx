import React from 'react';
import { useApyData } from '@/api';
import { capFirstLetter, findInObjArr, getRandomNumber, percentFormatter } from '@/utils';
import { Tooltip } from './tooltip-default';

export const ApyToolitp = ({ symbol, oldApy }: { symbol?: string; oldApy?: number | string }) => {
    const { queryAssetApys } = useApyData();

    if (!symbol) return <span>{percentFormatter.format(Number(oldApy || 0))}</span>;

    const rewardApy = findInObjArr('symbol', symbol, queryAssetApys.data);
    if (rewardApy) {
        const { apysByToken, asset, assetType, name, symbol, totalApy } = rewardApy;
        const percent = percentFormatter.format(Number(totalApy) / 100);
        if (apysByToken?.length) {
            return (
                <Tooltip id={`${asset}-${getRandomNumber()}`} content={percent}>
                    <div className="min-w-[120px]">
                        <span className="font-bold">APY Breakdown</span>
                        <ul>
                            {apysByToken
                                .sort((a: any, b: any) => a.symbol.length - b.symbol.length)
                                .map((x: any) => (
                                    <li
                                        className={`text-sm flex justify-between items-center gap-6 ${
                                            x?.symbol === 'yield' ? 'border-t mt-1 pt-1' : ''
                                        }`}
                                        key={`reward-apy-tooltip-${asset}-${
                                            x.asset
                                        }-${getRandomNumber()}`}
                                    >
                                        {x?.symbol?.length >= 5 ? (
                                            <span>{capFirstLetter(x?.symbol) || x.asset}</span>
                                        ) : (
                                            <span>{x?.symbol || x.asset}</span>
                                        )}
                                        <span>{percentFormatter.format(Number(x.apy) / 100)}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </Tooltip>
            );
        }
        return <span>{percent}</span>;
    }
    return <span>{percentFormatter.format(Number(oldApy || 0))}</span>;
};

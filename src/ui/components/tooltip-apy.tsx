import React from 'react';
import { useApyData } from '@/api';
import {
    CONTRACTS,
    VMEX_VEVMEX_CHAINID,
    capFirstLetter,
    findInObjArr,
    getRandomNumber,
    percentFormatter,
} from '@/utils';
import { Tooltip } from './tooltip-default';
import { useVaultsContext } from '@/store';

export const ApyToolitp = ({
    symbol,
    oldApy,
    trancheId,
}: {
    symbol?: string;
    trancheId?: string;
    oldApy?: number | string;
}) => {
    const { queryAssetApys } = useApyData();
    const { vaults } = useVaultsContext();

    if (!symbol) return <span>{percentFormatter.format(Number(oldApy || 0))}</span>;

    // if(symbol?.toLowerCase() === 'weth' || symbol?.toLowerCase() === 'usdc') console.log("vaults", address, symbol, trancheId, vaults);
    const _apysByToken = [];
    let _total = 0;
    // Look in vaults for juicy APY
    const foundInVault = vaults?.find(
        (v) =>
            v.underlyingSymbol?.toLowerCase() === symbol?.toLowerCase() &&
            String(v.vaultSymbol.charAt(v.vaultSymbol.length - 1)) === String(trancheId),
    );
    if (foundInVault) {
        console.log('found', foundInVault);
        const realAPR = Number(foundInVault.gaugeAPR) * 100;
        _apysByToken.push({
            apy: String(realAPR),
            asset: CONTRACTS[VMEX_VEVMEX_CHAINID].vmex,
            name: 'VMEX Finance',
            symbol: 'VMEX',
        });
        _total = _total + realAPR;
    }

    const rewardApy = findInObjArr('symbol', symbol, queryAssetApys.data);
    if (rewardApy) {
        const { apysByToken, asset, assetType, name, symbol, totalApy } = rewardApy;
        _total = _total + Number(totalApy);
        _apysByToken.push(...apysByToken);
    }

    if (_apysByToken?.length) {
        const percent = percentFormatter.format(Number(_total) / 100);

        return (
            <Tooltip id={`${symbol}-${getRandomNumber()}-${trancheId}`} content={percent}>
                <div className="min-w-[120px]">
                    <span className="font-bold">APY Breakdown</span>
                    <ul>
                        {_apysByToken
                            .sort((a: any, b: any) => a?.symbol?.length - b?.symbol?.length)
                            .map((x: any) => (
                                <li
                                    className={`text-sm flex justify-between items-center gap-6 ${
                                        x?.symbol === 'yield' ? 'border-t mt-1 pt-1' : ''
                                    }`}
                                    key={`reward-apy-tooltip-${symbol}-${trancheId}-${
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
    return <span>{percentFormatter.format(Number(oldApy || 0))}</span>;
};

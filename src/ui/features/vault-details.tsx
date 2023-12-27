import React from 'react';
import { IVaultAsset } from '@/api';
import { AssetDisplay, NumberDisplay, PercentChangeDisplay } from '../components';
import { NETWORKS, getNetworkName, percentFormatter } from '@/utils';
import { GoLinkExternal } from 'react-icons/go';
import { useWindowSize } from '@/hooks';

type IVaultDetails = {
    vault?: IVaultAsset;
};

export const VaultDetails = ({ vault, deposited }: IVaultDetails & { deposited?: string }) => {
    const { isBigger } = useWindowSize();
    const network = getNetworkName();
    return (
        <div>
            <a
                href={`${NETWORKS[network]?.explorer}/address/${vault?.gaugeAddress}`}
                target="_blank"
                className="flex items-center gap-1 w-fit"
                rel="noreferrer"
            >
                <AssetDisplay name={vault?.vaultSymbol || 'ETH'} size="xl" />
                <GoLinkExternal />
            </a>
            <div className="flex flex-row justify-between items-center mt-2 px-2">
                <NumberDisplay size="xl" value={`${vault?.gaugeBoost || '0'}`} label="Boost" />
                <NumberDisplay
                    size="xl"
                    value={percentFormatter.format(vault?.gaugeAPR || 0)}
                    label="Gauge APR"
                    align="right"
                />
            </div>

            <div className="flex flex-row justify-between items-center mt-2 px-2">
                <NumberDisplay
                    value={percentFormatter.format(vault?.vaultApy || 0)}
                    label={isBigger('sm') ? `Tranche Asset APY` : 'Asset APY'}
                />
                <NumberDisplay
                    value={`${vault?.vaultDeposited?.normalized || '0.0'}`}
                    label={isBigger('sm') ? 'Deposited in Tranche' : 'Total Deposited'}
                    align="right"
                    units={vault?.underlyingSymbol}
                />
            </div>

            <div className="flex flex-row justify-between items-center mt-2 px-2">
                <NumberDisplay
                    value={`${vault?.gaugeStaked?.normalized || '0.0'}`}
                    label="Total Staked"
                    units={vault?.underlyingSymbol}
                />
                <NumberDisplay
                    value={`${deposited || '0.0'}`}
                    label="Your Staked"
                    align="right"
                    units={vault?.underlyingSymbol}
                />
            </div>
        </div>
    );
};

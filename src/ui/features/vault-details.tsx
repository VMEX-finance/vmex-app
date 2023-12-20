import React from 'react';
import { IVaultAsset } from '@/api';
import { AssetDisplay, NumberDisplay, PercentChangeDisplay } from '../components';
import { NETWORKS, getNetworkName } from '@/utils';
import { GoLinkExternal } from 'react-icons/go';

type IVaultDetails = {
    vault?: IVaultAsset;
};

export const VaultDetails = ({ vault, deposited }: IVaultDetails & { deposited?: string }) => {
    const network = getNetworkName();
    return (
        <div>
            <a
                href={`${NETWORKS[network]?.explorer}/address/${vault?.gaugeAddress}`}
                target="_blank"
                className="flex items-center gap-1"
                rel="noreferrer"
            >
                <AssetDisplay
                    logo={vault?.vaultIcon || '/coins/eth.svg'}
                    name={vault?.vaultName || 'ETH'}
                    size="xl"
                />
                <GoLinkExternal />
            </a>
            <div className="flex flex-row justify-between items-center mt-2 px-2">
                <NumberDisplay size="xl" value={`${vault?.gaugeBoost || '0'}`} label="Boost" />
                <NumberDisplay
                    size="xl"
                    value={`${vault?.vaultApy || '0'} %`}
                    label="Vault APY"
                    align="right"
                />
            </div>

            <div className="flex flex-row justify-between items-center mt-2 px-2">
                <NumberDisplay value={`${vault?.gaugeAPR || '0'} %`} label="Gauge APR" />
                <NumberDisplay
                    value={`${vault?.gaugeStaked?.normalized || '0.0'}`}
                    label="Total Staked"
                    align="right"
                />
            </div>

            <div className="flex flex-row justify-between items-center mt-2 px-2">
                <NumberDisplay
                    value={`${vault?.vaultDeposited?.normalized || '0.0'}`}
                    label="Total Deposited"
                />
                <NumberDisplay
                    value={`${deposited || '0.0'}`}
                    label="Your Deposited"
                    align="right"
                />
            </div>
        </div>
    );
};

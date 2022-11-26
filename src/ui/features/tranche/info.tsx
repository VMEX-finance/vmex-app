import { truncateAddress } from '../../../utils/helpers';
import React from 'react';
import { Card } from '../../components/cards';
import { MultipleAssetsDisplay, NumberDisplay } from '../../components/displays';

// TODO: implment interface

export const TrancheInfoCard = ({ tranche }: any) => {
    return (
        <Card>
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-2xl mb-6">Info</h2>
                    <p>Assets</p>
                    <MultipleAssetsDisplay assets={tranche.assets} show="all" />
                </div>
                <div className="grid grid-cols-2 justify-between gap-7">
                    <NumberDisplay
                        label="Total Supplied"
                        value={`$${tranche.longSupply}M`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Total Borrowed"
                        value={`$${tranche.longBorrow}M`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Available Liquidity"
                        value={`$${tranche.liquidity}`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Pool Utilization"
                        value={`${tranche.poolUtilization}%`}
                        size="xl"
                    />
                    <NumberDisplay label="Upgradeable" value={`${tranche.upgradeable}`} size="xl" />
                    <NumberDisplay label="Whitelist" value={`${tranche.whitelist}`} size="xl" />
                    <NumberDisplay
                        label="Admin"
                        value={
                            <a
                                href={`https://etherscan.io/address/${tranche.admin}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {truncateAddress(tranche.admin)}
                            </a>
                        }
                        size="xl"
                    />
                </div>
            </div>
        </Card>
    );
};

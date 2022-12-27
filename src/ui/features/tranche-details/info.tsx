import { makeCompact, percentFormatter, truncateAddress } from '../../../utils/helpers';
import React from 'react';
import { Card } from '../../components/cards';
import { MultipleAssetsDisplay, NumberDisplay } from '../../components/displays';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { IGraphTrancheDataProps } from '../../../api/subgraph/types';

type ITrancheInfoCard = {
    tranche?: IGraphTrancheDataProps;
    loading?: boolean;
};

export const TrancheInfoCard = ({ tranche, loading }: ITrancheInfoCard) => {
    const { tranche: _tranche } = useSelectedTrancheContext();

    return (
        <Card loading={loading}>
            <div className="flex flex-col gap-8">
                <div>
                    <h2 className="text-2xl mb-6">Info</h2>
                    <p>Assets</p>
                    <MultipleAssetsDisplay assets={tranche?.assets || _tranche.assets} show="all" />
                </div>
                <div className="grid grid-cols-2 justify-between gap-7">
                    <NumberDisplay
                        label="Total Supplied"
                        value={`${tranche?.totalSupplied || _tranche.supplyTotal}`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Total Borrowed"
                        value={`${tranche?.totalBorrowed || _tranche.borrowTotal}`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Available Liquidity"
                        value={`${tranche?.availableLiquidity || _tranche.liquidity}`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Pool Utilization"
                        value={_tranche.poolUtilization}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Whitelist"
                        value={`${tranche?.whitelist || _tranche.whitelist || 'No'}`}
                        size="xl"
                    />
                    <NumberDisplay
                        label="Admin"
                        value={
                            <a
                                href={`https://etherscan.io/address/${
                                    tranche?.admin || _tranche.admin
                                }`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {(tranche?.admin || _tranche.admin) &&
                                    truncateAddress(tranche?.admin || _tranche.admin)}
                            </a>
                        }
                        size="xl"
                    />
                </div>
            </div>
        </Card>
    );
};

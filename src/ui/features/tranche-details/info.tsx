import { makeCompact, percentFormatter, truncateAddress } from '../../../utils/helpers';
import React from 'react';
import { Card } from '../../components/cards';
import { MultipleAssetsDisplay, NumberDisplay } from '../../components/displays';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { IGraphTrancheDataProps } from '../../../api/subgraph/types';

type ITrancheInfoCard = {
    tranche?: IGraphTrancheDataProps;
};

export const TrancheInfoCard = ({ tranche }: ITrancheInfoCard) => {
    const { tranche: _tranche } = useSelectedTrancheContext();

    const calculatePoolUtility = () => {
        if (_tranche) {
            const supplied = parseFloat(_tranche.supplyTotal.slice(1).replaceAll(',', ''));
            const borrowed = parseFloat(_tranche.borrowTotal.slice(1).replaceAll(',', ''));
            const final = (supplied - borrowed) / supplied;
            return percentFormatter.format(final);
        } else {
            return percentFormatter.format(0);
        }
    };

    return (
        <Card>
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
                        value={calculatePoolUtility()}
                        // value={`${percentFormatter.format(
                        //     tranche?.utilityRate || _tranche.poolUtilization
                        // )}`} // TODO
                        size="xl"
                    />
                    <NumberDisplay
                        label="Whitelist"
                        value={`${tranche?.whitelist || _tranche.whitelist}`}
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
                                {truncateAddress(tranche?.admin || _tranche.admin)}
                            </a>
                        }
                        size="xl"
                    />
                </div>
            </div>
        </Card>
    );
};

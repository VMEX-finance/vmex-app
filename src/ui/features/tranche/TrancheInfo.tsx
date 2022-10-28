import React from 'react';
import { Card } from '../../components/cards';
import { MultipleAssetsDisplay } from '../../components/displays';
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
                    <div>
                        <p>Total Supplied</p>
                        <p className="text-2xl">${tranche.longSupply}M</p>
                    </div>
                    <div>
                        <p>Total Borrowed</p>
                        <p className="text-2xl">${tranche.longBorrow}M</p>
                    </div>
                    <div>
                        <p>Available Liquidity</p>
                        <p className="text-2xl">${tranche.liquidity}</p>
                    </div>
                    <div>
                        <p>Pool Utilization</p>
                        <p className="text-2xl">{tranche.poolUtilization}%</p>
                    </div>
                    <div>
                        <p>Upgradeable</p>
                        <p className="text-2xl">{tranche.upgradeable}</p>
                    </div>
                    <div>
                        <p>Whitelist</p>
                        <p className="text-2xl">{tranche.whitelist}</p>
                    </div>
                    <div>
                        <p>Admin</p>
                        <p className="text-2xl">{tranche.admin}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

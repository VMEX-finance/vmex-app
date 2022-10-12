import React from 'react';
import type { TrancheSupply } from '../../../models/tranche-supply';
import type { TrancheBorrow } from '../../../models/tranche-borrow';
import { useDialogController } from '../../../hooks/dialogs';
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: TrancheSupply[] | TrancheBorrow[];
    primary?: any;
}
export const TrancheInfo: React.FC<IAvailableLiquidityTable> = ({ children, data, primary }) => {
    const navigate = useNavigate();
    const { openDialog } = useDialogController();

    const route = (tranche: string) => navigate(`/tranches/${tranche.replace(/\s+/g, '-')}`, {});

    const mode = primary ? 'Collateral' : 'Liquidity';
    return (
        <div className="flex flex-col">
            <div>
                <h2 className="text-xl mb-8">Info</h2>
                <p>Assets</p>
                <img src="tokens/token-UNI.svg" alt="" className="h-8 w-8 mb-8" />
            </div>
            <div className="grid grid-cols-2 justify-between gap-7">
                <div>
                    <p>Total Supplied</p>
                    <p className="text-2xl">12.47M</p>
                </div>
                <div>
                    <p>Available Liquidity</p>
                    <p className="text-2xl">$0.00</p>
                </div>
                <div>
                    <p>Upgradeable</p>
                    <p className="text-2xl">Yes</p>
                </div>
                <div>
                    <p>Platform Fee</p>
                    <p className="text-2xl">10%</p>
                </div>
                <div>
                    <p>Oracle</p>
                    <p className="text-2xl">Chainlink</p>
                </div>
                <div>
                    <p>Total Borrowed</p>
                    <p className="text-2xl">12.47M</p>
                </div>
                <div>
                    <p>Pool Utilization</p>
                    <p className="text-2xl">$0.00</p>
                </div>
                <div>
                    <p>Upgradeable</p>
                    <p className="text-2xl">Yes</p>
                </div>
                <div>
                    <p>Admin</p>
                    <p className="text-2xl">0x7d...8F</p>
                </div>
                <div>
                    <p>Whitelist</p>
                    <p className="text-2xl">Yes</p>
                </div>
            </div>
        </div>
    );
};

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
export const TrancheTable: React.FC<IAvailableLiquidityTable> = ({ children, data, primary }) => {
    const navigate = useNavigate();
    const { openDialog } = useDialogController();

    const route = (tranche: string) => navigate(`/tranches/${tranche.replace(/\s+/g, '-')}`, {});

    const mode = primary ? 'Collateral' : 'Liquidity';
    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-400 text-sm font-semibold text-left">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5">
                        Balance
                    </th>
                    <th scope="col" className="py-3.5">
                        APY
                    </th>
                    <th scope="col" className="py-3.5">
                        {mode}
                    </th>
                    <th scope="col" className="py-3.5"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.map((el, i) => {
                        console.log(el);
                        return (
                            <tr
                                key={`${el.asset}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={() => {}}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={el.logo} alt={el.asset} className="h-8 w-8" />
                                        <div className="text-lg">{el.asset}</div>
                                    </div>
                                </td>
                                <td>
                                    {el.balance} {el.asset}
                                </td>
                                <td>{el.apy}%</td>
                                <td>${primary ? el.collateral : el.liquidity}M</td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

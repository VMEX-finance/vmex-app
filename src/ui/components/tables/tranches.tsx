import React from 'react';
import type { Tranche } from '../../../models/tranches';
// import { useDialogController } from "../../../hooks/dialogs";
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: Tranche[];
}
export const TranchesTable: React.FC<IAvailableLiquidityTable> = ({ /* children, */ data }) => {
    const navigate = useNavigate();
    // const { openDialog } = useDialogController();

    const route = (tranche: string) => navigate(`/tranches/${tranche.replace(/\s+/g, '-')}`, {});

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-900 text-sm font-semibold text-left">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6">
                        Tranche
                    </th>
                    <th scope="col" className="py-3.5">
                        Assets
                    </th>
                    <th scope="col" className="py-3.5">
                        Aggregate Rating
                    </th>
                    <th scope="col" className="py-3.5">
                        Your Amount
                    </th>
                    <th scope="col" className="py-3.5">
                        Supplied
                    </th>
                    <th scope="col" className="py-3.5">
                        Borrowed
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
                                key={`${el.tranche}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={() => route(el.tranche)}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={el.assets} alt={el.tranche} className="h-8 w-8" />
                                        <div className="text-lg">{el.tranche}</div>
                                    </div>
                                </td>
                                <td>{el.aggregateRating}</td>
                                <td>{el.yourAmount}%</td>
                                <td>${el.supplyTotal}M</td>
                                <td>${el.borrowTotal}M</td>
                                <td>
                                    <Button label="View Details" />
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

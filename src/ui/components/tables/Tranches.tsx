import React from 'react';
import type { Tranche } from '../../../models/tranches';
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';
import { determineRatingColor } from '../../../utils/helpers';
import { useSelectedTrancheContext } from '../../../store/contexts';

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: Tranche[];
}
export const TranchesTable: React.FC<IAvailableLiquidityTable> = ({ data }) => {
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, tranche: string, view = 'overview') => {
        e.stopPropagation();
        updateTranche('name', tranche);
        navigate(`/tranches/${tranche.replace(/\s+/g, '-')}`, { state: { view } });
    };

    const headers = [
        'Tranche',
        'Assets',
        'Aggregate Rating',
        'Your Amount',
        'Supplied',
        'Borrowed',
        '',
    ];

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-400 text-sm font-semibold text-left">
                    {headers.map((el: string, i: number) => (
                        <th
                            key={`tranches-header-${i}`}
                            scope="col"
                            className="py-3.5 first-of-type:sm:pl-6"
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.map((el, i) => {
                        return (
                            <tr
                                key={`${el.tranche}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={(e: any) => route(e, el.tranche)}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <td>{el.tranche}</td>
                                </td>

                                <td>
                                    <img src={el.assets} alt={el.tranche} className="h-8 w-8" />
                                </td>
                                <td style={{ color: determineRatingColor(el.aggregateRating) }}>
                                    {el.aggregateRating}
                                </td>
                                <td>{el.yourAmount}</td>
                                <td>${el.supplyTotal}M</td>
                                <td>${el.borrowTotal}M</td>
                                <td className="text-right pr-3.5">
                                    <Button
                                        label="View Details"
                                        onClick={(e) => route(e, el.tranche, 'details')}
                                    />
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

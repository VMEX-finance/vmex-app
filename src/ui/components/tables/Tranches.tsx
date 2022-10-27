import React from 'react';
import type { ITrancheProps } from '../../../models/tranches';
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';
import { determineRatingColor } from '../../../utils/helpers';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { MultipleAssetsDisplay } from '../displays';
import { useWindowSize } from '../../../hooks/ui';
import { IconTooltip } from '../tooltips/Icon';

interface IDataTable {
    data: ITrancheProps[];
}

export const TranchesTable: React.FC<IDataTable> = ({ data }) => {
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();
    const { width } = useWindowSize();

    const route = (e: Event, tranche: ITrancheProps, view = 'overview') => {
        e.stopPropagation();
        updateTranche('id', tranche.id);
        navigate(`/tranches/${tranche.name.replace(/\s+/g, '-')}`, { state: { view } });
    };

    const headers = [
        'Tranche',
        'Assets',
        width > 1000 ? 'Aggregate Rating' : 'Rating',
        width > 1000 ? 'Your Activity' : 'Activity',
        'Supplied',
        'Borrowed',
        '',
    ];

    const renderActivity = (status: string) => {
        // TODO: add tooltips to describe what these mean and/or add better icons
        const size = '18px';
        switch (status.toLowerCase()) {
            case 'supplied':
                return <IconTooltip text="Supplying" icon={<BsArrowDownCircle size={size} />} />;
            case 'borrowed':
                return <IconTooltip text="Borrowing" icon={<BsArrowUpCircle size={size} />} />;
            case 'both':
                return (
                    <div className="flex gap-2">
                        <IconTooltip text="Supplying" icon={<BsArrowDownCircle size={size} />} />
                        <IconTooltip text="Borrowing" icon={<BsArrowUpCircle size={size} />} />
                    </div>
                );
            default:
                return <></>;
        }
    };

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont mt-2">
            <thead className="">
                <tr className="text-gray-400 text-sm font-semibold text-left">
                    {headers.map((el: string, i: number) => (
                        <th
                            key={`tranches-header-${i}`}
                            scope="col"
                            className="py-3.5 min-w-[80px] first-of-type:pl-2 first-of-type:md:pl-6"
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
                                key={`${el.name}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={(e: any) => route(e, el)}
                            >
                                <td className="whitespace-nowrap py-4 pl-2 md:pl-4 pr-3">
                                    <span>{el.name}</span>
                                </td>

                                <td className="min-w-[120px]">
                                    <MultipleAssetsDisplay assets={el.assets} />
                                </td>
                                <td style={{ color: determineRatingColor(el.aggregateRating) }}>
                                    {el.aggregateRating}
                                </td>
                                <td>{renderActivity(el.yourActivity)}</td>
                                <td>${el.supplyTotal}M</td>
                                <td>${el.borrowTotal}M</td>
                                <td className="text-right pr-3.5">
                                    <Button
                                        label={width > 1000 ? 'View Details' : 'Details'}
                                        onClick={(e) => route(e, el, 'details')}
                                    />
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

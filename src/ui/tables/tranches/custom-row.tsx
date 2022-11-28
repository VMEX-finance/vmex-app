import { Button } from '../../components/buttons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { MultipleAssetsDisplay } from '../../components/displays';
import { useWindowSize } from '../../../hooks/ui';
import { determineRatingColor } from '../../../utils/helpers';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { Tooltip } from '../../components/tooltips';

const TranchesCustomRow = (props: any) => {
    const { name, assets, aggregateRating, yourActivity, supplyTotal, borrowTotal, id } = props;

    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, tranche: any, view = 'overview') => {
        e.stopPropagation();
        updateTranche('id', tranche.id);
        navigate(`/tranches/${tranche.name.replace(/\s+/g, '-')}`, { state: { view } });
    };

    const renderActivity = (status: string) => {
        const size = '20px';
        if (status) {
            switch (status.toLowerCase()) {
                case 'supplied':
                    return <Tooltip text="Supplying" content={<BsArrowDownCircle size={size} />} />;
                case 'borrowed':
                    return <Tooltip text="Borrowing" content={<BsArrowUpCircle size={size} />} />;
                case 'both':
                    return (
                        <div className="flex gap-2">
                            <Tooltip text="Supplying" content={<BsArrowDownCircle size={size} />} />
                            <Tooltip text="Borrowing" content={<BsArrowUpCircle size={size} />} />
                        </div>
                    );
                default:
                    return width < 900 ? <>None</> : <></>;
            }
        }
    };
    // Mobile
    if (width < 900) {
        return (
            <tr
                key={name}
                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer flex flex-col px-4 py-1 border border-y-[1px]"
                onClick={(e: any) => route(e, props)}
            >
                <td className="flex justify-between">
                    <span className="font-bold">Name</span>
                    <span>{name}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Assets</span>
                    <MultipleAssetsDisplay assets={assets} show={4} size="h-6 w-6" />
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Rating</span>
                    <span style={{ color: determineRatingColor(aggregateRating) }}>
                        {aggregateRating}
                    </span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Activity</span>
                    <span>{renderActivity(yourActivity)}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Supply</span>
                    <span>{supplyTotal}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Borrow</span>
                    <span>{borrowTotal}</span>
                </td>
            </tr>
        );
        // Desktop
    } else {
        return (
            <tr
                key={name}
                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer border border-y-[1px]"
                onClick={(e: any) => route(e, props)}
            >
                <td className="whitespace-nowrap py-4 pl-2 md:pl-4 pr-3">
                    <span>{name}</span>
                </td>

                <td className="min-w-[120px]">
                    <MultipleAssetsDisplay assets={assets} show={width > 1100 ? 4 : 2} />
                </td>
                <td className="text-lg" style={{ color: determineRatingColor(aggregateRating) }}>
                    {aggregateRating}
                </td>
                <td>{renderActivity(yourActivity)}</td>
                <td>{supplyTotal}</td>
                <td>{borrowTotal}</td>
                <td className="text-right pr-3.5">
                    <Button
                        label={width > 1000 ? 'View Details' : 'Details'}
                        onClick={(e: any) => route(e, { id, name }, 'details')}
                    />
                </td>
            </tr>
        );
    }
};

export { TranchesCustomRow };

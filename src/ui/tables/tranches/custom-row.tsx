import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { useWindowSize } from '@/hooks';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { Tooltip, MultipleAssetsDisplay, Button, Label } from '@/ui/components';

type ITranchesCustomRowProps = {
    name: string[];
    assets: string[];
    // aggregateRating: string;
    yourActivity: string;
    supplyTotal: string | number;
    borrowTotal: string | number;
    id: string | number;
    category: string;
};

const TranchesCustomRow = (props: ITranchesCustomRowProps) => {
    const { name, assets, yourActivity, supplyTotal, borrowTotal, id, category } = props;

    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, tranche: any, view: 'overview' | 'details' = 'overview') => {
        e.stopPropagation();
        updateTranche('id', tranche.id);
        navigate(`/tranches/${tranche.name?.toLowerCase().replace(/\s+/g, '-')}`, {
            state: { view, trancheId: tranche.id },
        });
    };

    const renderActivity = (status: string) => {
        const size = '20px';
        if (status) {
            switch (status?.toLowerCase()) {
                case 'loading':
                    return (
                        <div className="flex gap-2 animate-pulse">
                            <BsArrowDownCircle size={size} />
                            <BsArrowUpCircle size={size} />
                        </div>
                    );
                case 'supplied':
                    return (
                        <Tooltip text="Supplying">
                            <BsArrowDownCircle size={size} />
                        </Tooltip>
                    );
                case 'borrowed':
                    return (
                        <Tooltip text="Borrowing">
                            <BsArrowUpCircle size={size} />
                        </Tooltip>
                    );
                case 'both':
                    return (
                        <div className="flex gap-2">
                            <Tooltip text="Supplying">
                                <BsArrowDownCircle size={size} />
                            </Tooltip>
                            <Tooltip text="Borrowing">
                                <BsArrowUpCircle size={size} />
                            </Tooltip>
                        </div>
                    );
                default:
                    return <></>;
            }
        }
    };

    const renderCategory = () => {
        if (!category) return <></>;
        return <Label tooltip>{category}</Label>;
    };

    // Mobile
    if (width < 900) {
        return (
            <tr
                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer flex flex-col px-4 pb-1 pt-2 border-y-[1px] dark:border-neutral-800"
                onClick={(e: any) => route(e, props)}
            >
                <td className="flex justify-between">
                    <span className="font-bold">ID</span>
                    <span>{id}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Name</span>
                    <span>{name}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Assets</span>
                    <MultipleAssetsDisplay assets={assets} show={4} />
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Category</span>
                    <span>{renderCategory()}</span>
                </td>
                {/* <td className="flex justify-between">
                    <span className="font-bold">Rating</span>
                    <span style={{ color: determineRatingColor(aggregateRating) }}>
                        {aggregateRating || '-'}
                    </span>
                </td> */}
                <td className="flex justify-between">
                    <span className="font-bold">Activity</span>
                    <span>{renderActivity(yourActivity)}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Supplied</span>
                    <span>{supplyTotal}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Borrowed</span>
                    <span>{borrowTotal}</span>
                </td>
            </tr>
        );
        // Desktop
    } else {
        return (
            <tr
                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer border-y-[1px] dark:border-neutral-800"
                onClick={(e: any) => route(e, props)}
            >
                <td className="whitespace-nowrap py-3 pl-2 md:pl-4 pr-3">
                    <span>{id}</span>
                </td>
                <td className="whitespace-nowrap pl-4">
                    <span>{name}</span>
                </td>

                <td className="min-w-[120px] pl-4">
                    <MultipleAssetsDisplay assets={assets} show={width > 1100 ? 4 : 2} />
                </td>
                <td className="pl-4">{renderCategory()}</td>
                {/* <td
                    className="text-lg pl-4"
                    style={{ color: determineRatingColor(aggregateRating) }}
                >
                    {aggregateRating}
                </td> */}
                <td className="pl-4">
                    {<div className="max-w-fit">{renderActivity(yourActivity)}</div>}
                </td>
                <td className="pl-4">{supplyTotal}</td>
                <td className="pl-4">{borrowTotal}</td>
                <td className="text-right pr-3.5">
                    <div className="flex h-full w-full items-center justify-end">
                        <Button
                            type="accent"
                            onClick={(e: any) => route(e, { id, name }, 'details')}
                        >
                            {width < 1080 ? 'Details' : 'View Details'}
                        </Button>
                    </div>
                </td>
            </tr>
        );
    }
};

export { TranchesCustomRow };

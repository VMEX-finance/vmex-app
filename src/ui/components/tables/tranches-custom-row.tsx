import Image from 'next/image';
import { Button } from '../buttons';
import React from 'react';
import { capFirst, renderAsset, truncate } from '../../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';
import type { ITrancheProps } from '../../../models/tranches';
import { MultipleAssetsDisplay } from '../displays';
import { useWindowSize } from '../../../hooks/ui';
import { determineRatingColor } from '../../../utils/helpers';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { IconTooltip } from '../tooltips/Icon';

const TranchesCustomRow = (props: any) => {
    const { name, assets, aggregateRating, yourActivity, supplyTotal, borrowTotal, id } = props;

    const determineTypeColor = (str: string) => {
        if (str === 'Mint') return 'bg-green-300 !text-[16px]';
        if (str === 'Burn') return 'bg-red-300 !text-[16px]';
        return '';
    };
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, tranche: any, view = 'overview') => {
        e.stopPropagation();
        console.log(tranche);
        updateTranche('id', tranche.id);
        navigate(`/tranches/${tranche.name.replace(/\s+/g, '-')}`, { state: { view } });
    };

    const { width } = useWindowSize();

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
        <tr
            key={name}
            className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
        >
            <td className="whitespace-nowrap py-4 pl-2 md:pl-4 pr-3">
                <span>{name}</span>
            </td>

            <td className="min-w-[120px]">
                <MultipleAssetsDisplay assets={assets} />
            </td>
            <td style={{ color: determineRatingColor(aggregateRating) }}>{aggregateRating}</td>
            <td>{renderActivity(yourActivity)}</td>
            <td>${supplyTotal}M</td>
            <td>${borrowTotal}M</td>
            <td className="text-right pr-3.5">
                <Button
                    label={width > 1000 ? 'View Details' : 'Details'}
                    onClick={(e) => route(e, { id, name }, 'details')}
                />
            </td>
        </tr>
    );
};

export { TranchesCustomRow };

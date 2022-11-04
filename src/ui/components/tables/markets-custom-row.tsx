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
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { MarketsAsset } from '../../../models/markets';

const MarketsCustomRow = (props: any) => {
    const {
        asset,
        logo,
        tranche,
        trancheId,
        supplyApy,
        borrowApy,
        yourAmount,
        available,
        borrowTotal,
        supplyTotal,
        rating,
        strategies,
    } = props;

    const determineTypeColor = (str: string) => {
        if (str === 'Mint') return 'bg-green-300 !text-[16px]';
        if (str === 'Burn') return 'bg-red-300 !text-[16px]';
        return '';
    };
    const navigate = useNavigate();
    const { updateTranche, setAsset } = useSelectedTrancheContext();

    const route = (e: Event, market: MarketsAsset, view = 'overview') => {
        e.stopPropagation();
        setAsset(market.asset);
        updateTranche('id', market.trancheId);
        navigate(`/tranches/${market.tranche.replace(/\s+/g, '-')}`, { state: { view } });
    };

    const { width } = useWindowSize();
    console.log(props);
    return (
        <tr
            key={asset}
            className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
            onClick={(e: any) => route(e, props)}
        >
            <td className="whitespace-nowrap py-4 pl-2 md:pl-4 pr-2 text-sm">
                <div className="flex items-center gap-2">
                    <img src={logo} alt={asset} className="h-8 w-8" />
                    <div className="text-lg hidden lg:block">{asset}</div>
                </div>
            </td>
            <td className="min-w-[150px]">{tranche}</td>
            <td>{supplyApy}%</td>
            <td>{borrowApy}%</td>
            <td>
                {yourAmount} {asset}
            </td>
            <td>{available}</td>
            <td>${supplyTotal}M</td>
            <td>${borrowTotal}M</td>
            <td style={{ color: determineRatingColor(rating) }}>{rating}</td>
            <td className="">
                <div className="w-8 h-8">
                    {strategies ? (
                        <BsCheck className="w-full h-full text-[#00DD3E]" />
                    ) : (
                        <IoIosClose className="w-full h-full text-[#FF1F00]" />
                    )}
                </div>
            </td>
            <td className="text-right pr-3.5">
                <Button
                    label={width > 1200 ? 'View Details' : 'Details'}
                    onClick={(e) => route(e, props, 'details')}
                />
            </td>
        </tr>
    );
};

export { MarketsCustomRow };

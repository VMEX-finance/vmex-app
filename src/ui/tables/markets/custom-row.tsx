import { Button } from '../../components/buttons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { useWindowSize } from '../../../hooks/ui';
import { determineRatingColor } from '../../../utils/helpers';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import type { IMarketsAsset } from '../../../models/markets';
import { AssetDisplay } from '../../components/displays';

const MarketsCustomRow = (props: any) => {
    const {
        asset,
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
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { updateTranche, setAsset } = useSelectedTrancheContext();

    const route = (e: Event, market: IMarketsAsset, view = 'overview') => {
        e.stopPropagation();
        setAsset(market.asset);
        updateTranche('id', market.trancheId);
        navigate(`/tranches/${market.tranche.replace(/\s+/g, '-')}`, { state: { view } });
    };

    // Mobile
    if (width < 900) {
        return (
            <tr
                key={`${asset}-${trancheId}`}
                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer flex flex-col px-4 py-1 border border-y-[1px] first-of-type:!border-t-[3px]"
                onClick={(e: any) => route(e, props)}
            >
                <td className="flex justify-between">
                    <span className="font-bold">Asset</span>
                    <div className="flex items-center gap-2">
                        <AssetDisplay name={asset} />
                    </div>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Tranche</span>
                    <span>{tranche}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Supply APY</span>
                    <span>{supplyApy}%</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Borrow APY</span>
                    <span>{borrowApy}%</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Your Amount</span>
                    <span>{yourAmount}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Available</span>
                    <span>{available}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Supply</span>
                    <span>{supplyTotal}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Borrow</span>
                    <span>{borrowTotal}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Rating</span>
                    <span style={{ color: determineRatingColor(rating) }}>{rating}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Strategy</span>
                    {strategies ? (
                        <BsCheck className="w-6 h-6 text-[#00DD3E]" />
                    ) : (
                        <IoIosClose className="w-6 h-6 text-[#FF1F00]" />
                    )}
                </td>
            </tr>
        );
        // Desktop
    } else {
        return (
            <tr
                key={`${asset}-${trancheId}`}
                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer border border-y-[1px]"
                onClick={(e: any) => route(e, props)}
            >
                <td className="whitespace-nowrap py-4 pl-2 md:pl-4 pr-2 text-sm">
                    <AssetDisplay name={asset} />
                </td>
                <td className="min-w-[150px]">{tranche}</td>
                <td>{supplyApy}%</td>
                <td>{borrowApy}%</td>
                <td>
                    {yourAmount} {asset}
                </td>
                <td>{available}</td>
                <td>{supplyTotal}</td>
                <td>{borrowTotal}</td>
                <td className="text-lg" style={{ color: determineRatingColor(rating) }}>
                    {rating}
                </td>
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
                        label={width > 1536 ? 'View Details' : 'Details'}
                        onClick={(e: any) => route(e, props, 'details')}
                    />
                </td>
            </tr>
        );
    }
};

export { MarketsCustomRow };

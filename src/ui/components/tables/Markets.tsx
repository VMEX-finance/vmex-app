import React from 'react';
import type { MarketsAsset } from '../../../models/markets';
import { useWindowSize } from '../../../hooks/ui';
import { Button } from '../buttons';
import { useNavigate } from 'react-router-dom';
import { determineRatingColor } from '../../../utils/helpers';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

interface IAvailableLiquidityTable {
    data: MarketsAsset[];
}
export const MarketsTable: React.FC<IAvailableLiquidityTable> = ({ data }) => {
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, market: MarketsAsset, view = 'overview') => {
        e.stopPropagation();
        updateTranche('id', market.trancheId);
        navigate(`/tranches/${market.tranche.replace(/\s+/g, '-')}`, { state: { view } });
    };

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-400 text-sm font-semibold text-left">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5">
                        Tranche
                    </th>
                    <th scope="col" className="py-3.5">
                        Supply APY%
                    </th>
                    <th scope="col" className="py-3.5">
                        Borrow APY%
                    </th>
                    <th scope="col" className="py-3.5">
                        Your Amount
                    </th>
                    <th scope="col" className="py-3.5">
                        Available
                    </th>
                    <th scope="col" className="py-3.5">
                        Supplied
                    </th>
                    <th scope="col" className="py-3.5">
                        Borrowed
                    </th>
                    <th scope="col" className="py-3.5">
                        Rating
                    </th>
                    <th scope="col" className="py-3.5">
                        Strategies
                    </th>
                    <th scope="col" className="py-3.5"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.map((el, i) => {
                        return (
                            <tr
                                key={`${el.asset}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={(e: any) => route(e, el)}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={el.logo} alt={el.asset} className="h-8 w-8" />
                                        <div className="text-lg hidden lg:block">{el.asset}</div>
                                    </div>
                                </td>
                                <td>{el.tranche}</td>
                                <td>{el.supplyApy}%</td>
                                <td>{el.borrowApy}%</td>
                                <td>
                                    {el.yourAmount} {el.asset}
                                </td>
                                <td>{el.available}</td>
                                <td>${el.supplyTotal}M</td>
                                <td>${el.borrowTotal}M</td>
                                <td style={{ color: determineRatingColor(el.rating) }}>
                                    {el.rating}
                                </td>
                                <td className="">
                                    <div className="w-8 h-8">
                                        {el.strategies ? (
                                            <BsCheck className="w-full h-full text-[#00DD3E]" />
                                        ) : (
                                            <IoIosClose className="w-full h-full text-[#FF1F00]" />
                                        )}
                                    </div>
                                </td>
                                <td className="text-right pr-3.5">
                                    <Button
                                        label={width > 1200 ? 'View Details' : 'Details'}
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

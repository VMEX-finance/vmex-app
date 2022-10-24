import React from 'react';
import type { AvailableAsset } from '../../../models/available-liquidity-model';
import { Button } from '../buttons';
import { useWindowSize } from '../../../hooks/ui';
import { MarketsAsset } from '../../../models/markets';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '../../../store/contexts';

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: MarketsAsset[];
}

export const YourBorrowsTable: React.FC<IAvailableLiquidityTable> = ({ data }) => {
    const { width } = useWindowSize();
    const headers = ['Asset', 'Amount', 'APY%', 'Tranche'];
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, market: MarketsAsset, view = 'overview') => {
        e.stopPropagation();
        updateTranche('id', market.trancheId);
        updateTranche('strategyEnabled', market.strategies);
        navigate(`/tranches/${market.tranche.replace(/\s+/g, '-')}`, { state: { view } });
    };
    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`py-3 text-left text-sm font-semibold text-gray-900 first-of-type:pl-4 first-of-type:md:pl-6`}
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.map((i) => {
                        return (
                            <tr
                                key={i.asset}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={() => console.log('reroute')}
                            >
                                <td className="whitespace-nowrap p-4 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={i.logo} alt={i.asset} className="h-8 w-8" />
                                        <div className="text-lg hidden md:block">{i.asset}</div>
                                    </div>
                                </td>
                                <td className="">{i.amount}</td>
                                <td>{i.apy_perc}</td>
                                <td className="">{i.trancheShort}</td>
                                {
                                    <td className="text-right hidden md:table-cell pr-3.5">
                                        <Button
                                            label={
                                                (width > 1535 && width < 2000) || width < 500
                                                    ? 'View'
                                                    : 'View Details'
                                            }
                                            // TODO: Send from here to appropriate traunch details view
                                            onClick={(e) => route(e, i, 'details')}
                                        />
                                    </td>
                                }
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

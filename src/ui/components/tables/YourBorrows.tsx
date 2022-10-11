import React from 'react';
import type { AvailableAsset } from '../../../models/available-liquidity-model';
import { Button } from '../buttons';
import { useWindowSize } from '../../../hooks/ui';

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: AvailableAsset[];
}

export const YourBorrowsTable: React.FC<IAvailableLiquidityTable> = ({ data }) => {
    const { width } = useWindowSize();
    const headers = ['Asset', 'Amount', 'APY%', 'Tranche', ''];

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
                            <tr key={i.asset} className="">
                                <td className="whitespace-nowrap p-4 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={i.logo} alt={i.asset} className="h-8 w-8" />
                                        <div className="text-lg hidden md:block">{i.asset}</div>
                                    </div>
                                </td>
                                <td className="">{i.amount}</td>
                                <td>{i.apy_perc}</td>
                                <td className="">{'VMEX High'}</td>
                                <td className="text-right hidden md:table-cell">
                                    <Button
                                        label={
                                            (width > 1535 && width < 2000) || width < 500
                                                ? 'View'
                                                : 'View Details'
                                        }
                                        // TODO: Send from here to appropriate traunch details view
                                        onClick={() => console.log('directing')}
                                    />
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

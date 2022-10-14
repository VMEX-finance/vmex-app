import React from 'react';
import type { TrancheSupply } from '../../../models/tranche-supply';
import type { TrancheBorrow } from '../../../models/tranche-borrow';
// TODO: why is there a primary prop? Not descriptive
interface IAvailableLiquidityTable {
    data: TrancheSupply[] | TrancheBorrow[];
    primary?: any;
}
export const TrancheTable: React.FC<IAvailableLiquidityTable> = ({ data, primary }) => {
    const mode = primary ? 'Collateral' : 'Liquidity';
    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-400 text-sm font-semibold text-left">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5">
                        Balance
                    </th>
                    <th scope="col" className="py-3.5">
                        APY
                    </th>
                    <th scope="col" className="py-3.5">
                        {mode}
                    </th>
                    <th scope="col" className="py-3.5"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.map((el, i) => {
                        return (
                            <tr key={`${el.asset}-${i}`} className="text-left" onClick={() => {}}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`/${el.logo}`}
                                            alt={el.asset}
                                            className="h-8 w-8"
                                        />
                                        <div className="text-lg">{el.asset}</div>
                                    </div>
                                </td>
                                <td>
                                    {el.balance} {el.asset}
                                </td>
                                <td>{el.apy}%</td>
                                {/* TODO: create a toggle component that holds all this information */}
                                {primary ? (
                                    el.collateral ? (
                                        <img
                                            src="/elements/Clicker2.svg"
                                            alt=""
                                            className="h-8 w-8"
                                        />
                                    ) : (
                                        <img
                                            src="/elements/Clicker.svg"
                                            alt=""
                                            className="h-8 w-8"
                                        />
                                    )
                                ) : (
                                    <td>${el.liquidity}M</td>
                                )}
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

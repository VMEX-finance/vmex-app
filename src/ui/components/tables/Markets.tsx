import React from "react";
import type { MarketsAsset } from "../../../models/markets";
import { useDialogController } from "../../../hooks/dialogs";
import { Button } from "../buttons";

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: MarketsAsset[]
}
export const MarketsTable: React.FC<IAvailableLiquidityTable> = ({ children, data }) => {
    const { openDialog } = useDialogController();

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-900 text-sm font-semibold">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6 text-left">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5">
                        Total Supplied
                    </th>
                    <th scope="col" className="py-3.5">
                        Supply APY
                    </th>
                    <th scope="col" className="py-3.5">
                        Total Borrowed
                    </th>
                    <th scope="col" className="py-3.5">
                        Borrow APY
                    </th>
                    <th scope="col" className="py-3.5">
                        Insurance Pool Size
                    </th>
                    <th scope="col" className="py-3.5">
                        
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {
                    data &&
                    data.map((i) => {
                        return (
                            <tr key={i.asset} className="text-center">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={i.logo} alt={i.asset} className="h-8 w-8"/>
                                        <div className="text-lg">{i.asset}</div>
                                    </div>
                                </td>
                                <td>{i.supplyTotal}M</td>
                                <td>{i.supplyApy}%</td>
                                <td>{i.borrowTotal}M</td>
                                <td>{i.borrowApy}%</td>
                                <td>{i.poolSize}M</td>
                                <td>
                                    <Button label="Details" primary />
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
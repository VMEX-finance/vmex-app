import React from "react";
import type { AvailableAsset } from "../../../models/available-liquidity-model";
import { useDialogController } from "../../../hooks/dialogs";
import { Button } from "../buttons";

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: AvailableAsset[]
}

export const ViewBorrowedAssetsTable: React.FC<IAvailableLiquidityTable> = ({ children, data }) => {
    const { openDialog } = useDialogController();

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="">
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        Available
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        APY% (Variable)
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        APY% (Stable)
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        
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
                                <td className="text-right">
                                    {i.amount}
                                </td>
                                <td>
                                    {"-"}
                                </td>
                                <td>
                                    {"-"}
                                </td>
                                <td>
                                    <Button 
                                        primary
                                        label={"Borrow"} 
                                        onClick={() => openDialog("borrow-asset-dialog", {...i})}
                                    />
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
import React from "react";
import type { AvailableAsset } from "../../models/available-liquidity-model";
import { BsCheck } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import Button from "../buttons/Button"
import useDialogController from "../../hooks/dialogs/useDialogController";

interface IAvailableLiquidityTable extends React.PropsWithChildren {
    data: AvailableAsset[]
}
const AvailableLiquidityTable: React.FC<IAvailableLiquidityTable> = ({ children, data }) => {
    const { openDialog } = useDialogController();

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="">
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        Balance
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        Can be Collatoral
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-semibold text-gray-900">
                        APY%
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
                                <td className="text-center">{i.amount} {i.unit}</td>
                                <td className="">
                                    <div className="w-10 h-10 mx-auto">
                                        {i.canBeCollat ? <BsCheck className="w-full h-full text-emerald-600" /> : <IoIosClose className="w-full h-full text-red-600"/>}
                                    </div>
                                </td>
                                <td>{i.apy_perc}</td>
                                <td>
                                    <Button label="Loan Asset" onClick={() => openDialog("loan-asset-dialog", {...i})}/>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default AvailableLiquidityTable;
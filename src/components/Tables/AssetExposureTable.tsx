import React from "react";
import { ITrancheBasedAssetExposure, AssetExposureType } from "../../models/asset-exposure-model"

interface IAssetExposureTable extends React.PropsWithChildren {
    data: ITrancheBasedAssetExposure
}


const AssetExposureTable: React.FC<IAssetExposureTable> = ({ children, data }) => {
    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Asset
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        APY%
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        COL%
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        INS%
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {
                    data &&
                    data.assets.map((i) => {
                        return (
                            <tr key={i.asset}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img src={i.logo} className="h-8 w-8"/>
                                        <div className="text-lg">{i.asset}</div>
                                    </div>
                                </td>
                                <td>{i.amount} {i.unit}</td>
                                <td>{i.apy_perc}</td>
                                <td>{i.collateral_perc}</td>
                                <td>{i.insurance_perc}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
export default AssetExposureTable;
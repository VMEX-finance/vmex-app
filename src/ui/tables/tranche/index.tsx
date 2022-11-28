import React from 'react';
import { useDialogController } from '../../../hooks/dialogs';
import { AvailableAsset } from '../../../models/available-liquidity-model';
import { BasicToggle } from '../../components/toggles';

import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
interface ITableProps {
    data: AvailableAsset[];
    type?: 'supply' | 'borrow';
}
export const TrancheTable: React.FC<ITableProps> = ({ data, type }) => {
    const { openDialog } = useDialogController();
    const mode = type === 'supply' ? 'Can be collateral' : 'Available borrows';

    const fallbackImg = (asset: string) => {
        if (asset === 'triCrypto2') return 'CRV';
        else return asset;
    };

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
                        {
                            console.log('el:', el);
                        }
                        return (
                            <tr
                                key={`${el.asset}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={() =>
                                    openDialog(
                                        type === 'supply'
                                            ? 'loan-asset-dialog'
                                            : 'borrow-asset-dialog',
                                        { ...el },
                                    )
                                }
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`/tokens/token-${fallbackImg(el.asset)}.svg`}
                                            alt={el.asset}
                                            className="h-8 w-8"
                                        />
                                        <div className="text-lg">{el.asset}</div>
                                    </div>
                                </td>
                                <td>
                                    {el.amount} {el.asset}
                                </td>
                                <td>{el.apy_perc}%</td>
                                <td>
                                    {type === 'supply' ? (
                                        <div className="w-10 h-10">
                                            {el.canBeCollat ? (
                                                <BsCheck className="w-full h-full text-emerald-600" />
                                            ) : (
                                                <IoIosClose className="w-full h-full text-red-600" />
                                            )}
                                        </div>
                                    ) : (
                                        `${el.liquidity}`
                                    )}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

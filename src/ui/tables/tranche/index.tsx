import { useUserData, useUserTrancheData } from '../../../api';
import { useWalletState } from '../../../hooks/wallet';
import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { useDialogController } from '../../../hooks/dialogs';
import { AvailableAsset } from '../../../models/available-liquidity-model';
import { useSelectedTrancheContext } from '../../../store/contexts';

interface ITableProps {
    data: AvailableAsset[];
    type?: 'supply' | 'borrow';
}
export const TrancheTable: React.FC<ITableProps> = ({ data, type }) => {
    const { address } = useWalletState();
    const { tranche } = useSelectedTrancheContext();
    const { queryUserActivity, queryUserWallet } = useUserData(address);
    const { queryUserTrancheData } = useUserTrancheData(address, tranche.id);
    const { openDialog } = useDialogController();
    const mode1 = type === 'supply' ? 'Wallet Balance' : 'Available Borrows';
    const mode2 = type === 'supply' ? 'Can Collateralize' : 'Total liquidity';
    const userData =
        type === 'supply' ? queryUserActivity.data?.supplies : queryUserActivity.data?.borrows;

    const findAssetInUserSupplies = (asset: string) => {
        if (queryUserActivity.isLoading) return `0 ${asset}`;
        else {
            const found = userData?.find((el) => el.asset.toLowerCase() === asset.toLowerCase());
            if (found) return `${found?.amount} ${found?.asset}`;
            else return `0 ${asset}`;
        }
    };

    const findAssetInWallet = (asset: string) => {
        if (queryUserWallet.isLoading) return `0 ${asset}`;
        else {
            const userWalletData = queryUserWallet.data?.assets;
            const found = userWalletData?.find(
                (el) => el.asset.toLowerCase() === asset.toLowerCase(),
            );
            if (found) return `${found?.amountNative}`;
            else return `0`;
        }
    };

    const findAmountBorrwable = (asset: string, liquidity: number | string | undefined) => {
        if (queryUserTrancheData.isLoading) return `0 ${asset}`;
        else {
            const userWalletData = queryUserTrancheData.data?.assetBorrowingPower;
            const found = userWalletData?.find(
                (el) => el.asset.toLowerCase() === asset.toLowerCase(),
            );
            if (found)
                return `${
                    liquidity
                        ? Math.min(
                              parseFloat(found?.amountNative.replace(',', '')),
                              parseFloat(liquidity.toString()),
                          )
                        : found?.amountNative
                }`;
            //`${found?.amountNative}`//
            else return `0`;
        }
    };

    const fallbackImg = (asset: string) => {
        if (asset === 'triCrypto2') return 'CRV';
        else return asset;
    };

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr className="text-gray-900 text-sm font-semibold text-left">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5">
                        {mode1}
                    </th>
                    <th scope="col" className="py-3.5">
                        APY
                    </th>
                    <th scope="col" className="py-3.5">
                        {mode2}
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
                                onClick={() =>
                                    openDialog(
                                        type === 'supply'
                                            ? 'loan-asset-dialog'
                                            : 'borrow-asset-dialog',
                                        type === 'supply'
                                            ? { ...el, amount: findAssetInWallet(el.asset) }
                                            : {
                                                  ...el,
                                                  amount: findAmountBorrwable(
                                                      el.asset,
                                                      el.liquidity,
                                                  ),
                                              },
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
                                    {type === 'supply' ? (
                                        <span
                                            className={`${
                                                queryUserWallet.isLoading ? 'animate-pulse' : ''
                                            }`}
                                        >
                                            {findAssetInWallet(el.asset)} {el.asset}
                                        </span>
                                    ) : (
                                        <span
                                            className={`${
                                                queryUserWallet.isLoading ? 'animate-pulse' : ''
                                            }`}
                                        >
                                            {findAmountBorrwable(el.asset, el.liquidity)} {el.asset}
                                        </span>
                                    )}
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
                                        `${el.liquidity} ${el.asset}`
                                    )}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

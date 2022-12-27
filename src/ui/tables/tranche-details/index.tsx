import { useUserData, useUserTrancheData } from '../../../api';
import { useAccount } from 'wagmi';
import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { useDialogController } from '../../../hooks/dialogs';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { NumberAndDollar } from '../../components/displays';
import { useWindowSize } from '../../../hooks/ui';
import { AvailableAsset } from '@app/api/types';
import { BigNumber } from 'ethers';
import { bigNumberToNative } from '../../../utils/sdk-helpers';
import { numberFormatter } from '../../../utils/helpers';

interface ITableProps {
    data: AvailableAsset[];
    type: 'supply' | 'borrow';
}
export const TrancheTable: React.FC<ITableProps> = ({ data, type }) => {
    const { width, breakpoint } = useWindowSize();
    const { address } = useAccount();
    const { tranche } = useSelectedTrancheContext();
    const { queryUserWallet, getTokenBalance } = useUserData(address);
    const { queryUserTrancheData, findAssetInUserSuppliesOrBorrows, findAmountBorrowable } =
        useUserTrancheData(address, tranche.id);
    const { openDialog } = useDialogController();

    const mode1 =
        type === 'supply'
            ? width > breakpoint
                ? 'Wallet Balance'
                : 'Balance'
            : width > breakpoint
            ? 'Available Borrows'
            : 'Available';

    const mode2 =
        type === 'supply'
            ? width > breakpoint
                ? 'Can Collateralize'
                : 'Collateral'
            : width > breakpoint
            ? 'Total liquidity'
            : 'Liquidity';

    const isInList = (asset: string) => {
        if (!queryUserTrancheData.data) return false;
        const list = (
            type === 'borrow'
                ? queryUserTrancheData.data.borrows
                : queryUserTrancheData.data.supplies
        ).map((el) => el.asset);

        return list.includes(asset) ? true : false;
    };

    const compareListsSorter = (a: any, b: any) => {
        if (isInList(a.asset)) return -1;
        if (isInList(b.asset)) return 1;
        return 0;
    };

    return (
        <table className={`min-w-full divide-y divide-gray-300 font-basefont`}>
            <thead className="">
                <tr className="text-neutral900 text-sm font-semibold text-left">
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
            <tbody className="divide-y divide-gray-200">
                {data &&
                    data.sort(compareListsSorter).map((el, i) => {
                        return (
                            <tr
                                key={`${el.asset}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                onClick={() =>
                                    openDialog(
                                        type === 'supply'
                                            ? 'loan-asset-dialog'
                                            : 'borrow-asset-dialog',
                                        {
                                            asset: el.asset,
                                            trancheId: tranche.id,
                                        },
                                    )
                                }
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center gap-2">
                                        {isInList(el.asset) ? (
                                            <span className="absolute -translate-x-4 w-2 h-2 bg-brand-green-neon rounded-full" />
                                        ) : (
                                            <></>
                                        )}
                                        <img
                                            src={`/coins/${el.asset?.toLowerCase()}.svg`}
                                            alt={el.asset}
                                            className="h-8 w-8"
                                        />
                                        <div className="text-lg">{el.asset}</div>
                                    </div>
                                </td>
                                <td
                                    className={`${
                                        queryUserWallet.isLoading ? 'animate-pulse' : ''
                                    }`}
                                >
                                    <NumberAndDollar
                                        value={`${
                                            type === 'supply'
                                                ? `${bigNumberToNative(
                                                      BigNumber.from(
                                                          getTokenBalance(el.asset).amountNative,
                                                      ),
                                                      el.asset,
                                                  )} ${el.asset}`
                                                : `${bigNumberToNative(
                                                      findAmountBorrowable(
                                                          el.asset,
                                                          el.liquidity,
                                                          el.liquidityNative,
                                                      ).amountNative,
                                                      el.asset,
                                                  )} ${el.asset}`
                                        }`}
                                        dollar={`${
                                            type === 'supply'
                                                ? `${getTokenBalance(el.asset).amount}`
                                                : `${
                                                      findAmountBorrowable(
                                                          el.asset,
                                                          el.liquidity,
                                                          el.liquidityNative,
                                                      ).amount
                                                  }`
                                        }`}
                                        size="xs"
                                        color="text-black"
                                    />
                                </td>
                                <td>{el.apy}</td>
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
                                        `${numberFormatter.format(
                                            parseFloat(el.liquidity || '') || 0,
                                        )} ${el.asset}`
                                    )}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

import React from 'react';
import { AssetDisplay, NumberAndDollar } from '@/ui/components';
import { BigNumber } from 'ethers';
import { bigNumberToNative, determineHealthColor } from '@/utils';
import { useWindowSize, useDialogController } from '@/hooks';

export type IYourBorrowsTableItemProps = {
    assetAddress: string;
    asset: string;
    amount: string;
    amountNative: BigNumber;
    apy: number;
    tranche: string;
    trancheId: number;
    healthFactor?: number;
};

export type IYourBorrowsTableProps = {
    data: IYourBorrowsTableItemProps[];
    withHealth?: boolean;
    healthLoading?: boolean;
    responsive?: boolean;
};

export const YourBorrowsTable: React.FC<IYourBorrowsTableProps> = ({
    data,
    withHealth,
    healthLoading,
    responsive,
}) => {
    const { width, breakpoints } = useWindowSize();
    const { openDialog } = useDialogController();
    const headers = withHealth
        ? ['Asset', 'Amount', 'APY%', 'Health']
        : ['Asset', 'Amount', 'APY%'];

    return (
        <table className="min-w-full divide-y-2 divide-gray-300 dark:divide-neutral-800 font-basefont">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`py-2 text-left text-sm font-semibold text-neutral900 first-of-type:pl-2 first-of-type:md:pl-4`}
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                {data &&
                    data.map((i) => {
                        return (
                            <tr
                                key={`${i.trancheId}-${i.asset}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                onClick={() =>
                                    openDialog('borrow-asset-dialog', {
                                        ...i,
                                        view: 'Repay',
                                    })
                                }
                            >
                                <td className="whitespace-nowrap py-2 text-sm sm:pl-4">
                                    <AssetDisplay
                                        name={i.asset}
                                        noText={responsive && width < breakpoints.sm}
                                        size="sm"
                                    />
                                </td>
                                <td>
                                    <NumberAndDollar
                                        value={`${bigNumberToNative(i.amountNative, i.asset)}`}
                                        dollar={i.amount}
                                        size="xs"
                                        color="text-brand-black"
                                    />
                                </td>
                                <td>{i.apy}%</td>
                                {withHealth && (
                                    <td
                                        className={`${
                                            healthLoading ? 'animate-pulse' : ''
                                        } ${determineHealthColor(i.healthFactor)}`}
                                    >
                                        {(i.healthFactor || 0).toFixed(1)}
                                    </td>
                                )}
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

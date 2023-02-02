import React, { useState, useEffect } from 'react';
import { AssetDisplay, BasicToggle, NumberAndDollar } from '../../components';
import { BigNumber } from 'ethers';
import { useWindowSize, useDialogController } from '../../../hooks';
import { bigNumberToNative, determineHealthColor } from '../../../utils';

export type IYourSuppliesTableItemProps = {
    asset: string;
    amount: string;
    amountNative: BigNumber;
    collateral: boolean;
    apy: number;
    tranche: string;
    trancheId: number;
    healthFactor?: number;
};

export type IYourSuppliesTableProps = {
    data: IYourSuppliesTableItemProps[];
    withHealth?: boolean;
    healthLoading?: boolean;
};

export const YourSuppliesTable: React.FC<IYourSuppliesTableProps> = ({
    data,
    withHealth,
    healthLoading,
}) => {
    const { width } = useWindowSize();
    const [checked, setChecked] = useState<boolean[]>([]);
    const { openDialog } = useDialogController();

    useEffect(() => {
        if (data.length > 0) {
            const initialState = data.map((el) => el.collateral);
            setChecked(initialState);
        }
    }, [data]);

    const headers = withHealth
        ? ['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche', 'Health']
        : ['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche'];

    return (
        <table className="min-w-full divide-y-2 divide-gray-300 dark:divide-neutral-800 font-basefont">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`py-3 text-left text-sm font-semibold text-neutral900 first-of-type:pl-2 first-of-type:md:pl-6`}
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                {data.map((i, index) => {
                    return (
                        <tr
                            key={`${i.trancheId}-${i.asset}`}
                            className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                openDialog('loan-asset-dialog', {
                                    ...i,
                                    view: 'Withdraw',
                                });
                            }}
                        >
                            <td className="whitespace-nowrap p-4 text-sm sm:pl-6">
                                <AssetDisplay
                                    name={width > 600 ? i.asset : ''}
                                    logo={`/coins/${i.asset?.toLowerCase()}.svg`}
                                />
                            </td>
                            <td>
                                <NumberAndDollar
                                    value={`${bigNumberToNative(i.amountNative, i.asset)} ${
                                        width > 600 ? i.asset : ''
                                    }`}
                                    dollar={i.amount}
                                    size="xs"
                                    color="text-brand-black"
                                />
                            </td>
                            <td>
                                <BasicToggle
                                    checked={checked[index]}
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        openDialog('toggle-collateral-dialog', {
                                            ...i,
                                            checked,
                                            setChecked,
                                            index,
                                            trancheId: i.trancheId,
                                        });
                                        e.stopPropagation();
                                    }}
                                    size="small"
                                />
                            </td>
                            <td>{i.apy}%</td>
                            <td>{i.tranche}</td>
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

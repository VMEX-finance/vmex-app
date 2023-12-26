import React, { useState, useEffect } from 'react';
import { AssetDisplay, BasicToggle, NumberAndDollar, HealthFactor } from '@/ui/components';
import { BigNumber } from 'ethers';
import { useWindowSize, useDialogController } from '@/hooks';
import { bigNumberToNative } from '@/utils';

export type IYourSuppliesTableItemProps = {
    asset: string;
    assetAddress: string;
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
    responsive?: boolean;
};

export const YourSuppliesTable: React.FC<IYourSuppliesTableProps> = ({
    data,
    withHealth,
    healthLoading,
    responsive,
}) => {
    const { width, breakpoints } = useWindowSize();
    const [checked, setChecked] = useState<boolean[]>([]);
    const { openDialog } = useDialogController();

    useEffect(() => {
        if (data.length > 0) {
            const initialState = data.map((el) => el.collateral);
            setChecked(initialState);
        }
    }, [data]);

    const headers = withHealth
        ? ['Asset', 'Amount', 'Collateral', 'APY%', 'Health']
        : ['Asset', 'Amount', 'Collateral', 'APY%'];

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
                            <td className="whitespace-nowrap text-sm sm:pl-4">
                                <AssetDisplay
                                    name={i.asset}
                                    noText={responsive && width < breakpoints.sm}
                                />
                            </td>
                            <td className="py-2">
                                <NumberAndDollar
                                    value={`${bigNumberToNative(i.amountNative, i.asset)}`}
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
                            {withHealth && (
                                <td>
                                    <HealthFactor
                                        withChange={false}
                                        trancheId={i.trancheId.toString()}
                                        showInfo={false}
                                    />
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

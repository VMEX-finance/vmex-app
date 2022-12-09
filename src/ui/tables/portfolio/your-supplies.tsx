import { AssetDisplay, NumberAndDollar } from '../../components/displays';
import React from 'react';
import { useDialogController } from '../../../hooks/dialogs';
import { percentFormatter } from '../../../utils/helpers';
import { BasicToggle } from '../../components/toggles';
import { BigNumber } from 'ethers';

export type IYourSuppliesTableItemProps = {
    asset: string;
    amount: string;
    amountNative: BigNumber;
    collateral: boolean;
    apy: number;
    tranche: string;
    trancheId: number;
    healthFactor?: number | string;
};

export type IYourSuppliesTableProps = {
    data: IYourSuppliesTableItemProps[];
    withHealth?: boolean;
};

export const YourSuppliesTable: React.FC<IYourSuppliesTableProps> = ({ data, withHealth }) => {
    const { openDialog } = useDialogController();
    const headers = withHealth
        ? ['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche', 'Health']
        : ['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche'];

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
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
            <tbody className="divide-y divide-gray-200">
                {data.map((i) => {
                    return (
                        <tr
                            key={i.asset}
                            className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                            onClick={() =>
                                openDialog('loan-asset-dialog', { ...i, view: 'Withdraw' })
                            }
                        >
                            <td className="whitespace-nowrap p-4 text-sm sm:pl-6">
                                <AssetDisplay name={i.asset} />
                            </td>
                            <td>
                                <NumberAndDollar
                                    value={`${i.amountNative} ${i.asset}`}
                                    dollar={i.amount}
                                    size="xs"
                                    color="text-black"
                                />
                            </td>
                            <td className="">
                                <BasicToggle checked={i.collateral} disabled />
                            </td>
                            <td>{i.apy}%</td>
                            <td>{i.tranche}</td>
                            {withHealth && <td>{i.healthFactor}</td>}
                            {/* <td className="text-right pr-3.5 hidden md:table-cell">
                                    <Button
                                        label={
                                            (width > 1535 && width < 2000) || width < 500
                                                ? 'View'
                                                : 'View Details'
                                        }
                                        // TODO: Send from here to appropriate traunch details view
                                        onClick={() => console.log('directing')}
                                    />
                                </td> */}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

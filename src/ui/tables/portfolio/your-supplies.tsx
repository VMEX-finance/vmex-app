import { AssetDisplay, NumberAndDollar } from '../../components/displays';
import React, { useState, useEffect } from 'react';
import { useDialogController } from '../../../hooks/dialogs';
import { percentFormatter } from '../../../utils/helpers';
import { BasicToggle } from '../../components/toggles';
import { BigNumber } from 'ethers';
import { bigNumberToNative } from '../../../utils/sdk-helpers';
import { useModal } from '../../../hooks/ui';
import { markReserveAsCollateral } from '@vmex/sdk';
import { useSigner } from 'wagmi';
import { NETWORK, MAINNET_ASSET_MAPPINGS } from '../../../utils/sdk-helpers';

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
    const { submitTx, isSuccess, error, isLoading } = useModal('your-supplies-table');
    const [checked, setChecked] = useState<boolean[]>([]);

    useEffect(() => {
        if (data.length > 0) {
            const initialState = data.map((el) => el.collateral);
            setChecked(initialState);
        }
    }, [data]);
    const { data: signer } = useSigner();

    const { openDialog } = useDialogController();
    const headers = withHealth
        ? ['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche', 'Health']
        : ['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche'];

    const handleSubmit = async (asset: string, trancheId: number, index: number) => {
        if (signer) {
            let newArr = [...checked]; // copying the old datas array
            newArr[index] = !newArr[index];
            setChecked(newArr);
            console.log('checked: ', checked);
            await submitTx(async () => {
                markReserveAsCollateral({
                    signer: signer,
                    network: NETWORK,
                    asset: asset,
                    trancheId: trancheId,
                    useAsCollateral: newArr[index],
                });
            });
        }
    };

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
                {data.map((i, index) => {
                    return (
                        <tr
                            key={`${i.trancheId}-${i.asset}`}
                            className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                            onClick={() =>
                                openDialog('loan-asset-dialog', {
                                    asset: i.asset,
                                    trancheId: i.trancheId,
                                    view: 'Withdraw',
                                })
                            }
                        >
                            <td className="whitespace-nowrap p-4 text-sm sm:pl-6">
                                <AssetDisplay name={i.asset} />
                            </td>
                            <td>
                                <NumberAndDollar
                                    value={`${bigNumberToNative(i.amountNative, i.asset)} ${
                                        i.asset
                                    }`}
                                    dollar={i.amount}
                                    size="xs"
                                    color="text-black"
                                />
                            </td>
                            <td className="">
                                <BasicToggle
                                    checked={checked[index]}
                                    disabled={isLoading}
                                    onClick={(e: any) => e.stopPropagation()}
                                    onChange={() =>
                                        handleSubmit(
                                            MAINNET_ASSET_MAPPINGS.get(i.asset) || '',
                                            i.trancheId,
                                            index,
                                        )
                                    }
                                />
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

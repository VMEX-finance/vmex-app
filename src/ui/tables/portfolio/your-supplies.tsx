import React, { useState, useEffect } from 'react';
import { AssetDisplay, NumberAndDollar } from '../../components';
import { BigNumber } from 'ethers';
import { useModal, useWindowSize, useDialogController } from '../../../hooks';
import { markReserveAsCollateral } from '@vmexfinance/sdk';
import { useSigner } from 'wagmi';
import { NETWORK, bigNumberToNative, SDK_PARAMS } from '../../../utils';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';

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
    const { width } = useWindowSize();
    const { submitTx, isLoading } = useModal('your-supplies-table');
    const [checked, setChecked] = useState<boolean[]>([]);
    const { data: signer } = useSigner();
    const { openDialog } = useDialogController();

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
                    test: SDK_PARAMS.test,
                    providerRpc: SDK_PARAMS.providerRpc,
                });
            });
        }
    };

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
                                    ...i,
                                    view: 'Withdraw',
                                })
                            }
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
                                    color="text-black"
                                />
                            </td>
                            <td>
                                {checked[index] ? (
                                    <BsCheck className="w-8 h-8 text-green-500" />
                                ) : (
                                    <IoIosClose className="w-8 h-8 text-red-500" />
                                )}
                            </td>
                            <td>{i.apy}%</td>
                            <td>{i.tranche}</td>
                            {withHealth && <td>{i.healthFactor}</td>}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

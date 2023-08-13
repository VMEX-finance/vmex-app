import React from 'react';
import { AssetDisplay, NumberAndDollar } from '../../components/displays';
import { BigNumber } from 'ethers';
import { bigNumberToNative } from '../../../utils';
import { useWindowSize, useDialogController } from '../../../hooks';
import { Button, Card } from '../../components';

export type IYourRewardsTableItemProps = {
    asset: string;
    amountUsd: string;
    amountNative: BigNumber;
};

export type IYourRewardsTableProps = {
    data: IYourRewardsTableItemProps[];
    isLoading: boolean;
};

export const YourRewardsTable: React.FC<IYourRewardsTableProps> = ({ data, isLoading }) => {
    const { width } = useWindowSize();
    const { openDialog } = useDialogController();
    const headers = ['Asset', 'Amount', ''];

    return (
        <Card loading={isLoading} title={`Your Rewards`} titleClass="text-lg mb-2">
            {data.length ? (
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
                        {data &&
                            data.map((i) => {
                                return (
                                    <tr
                                        key={`reward-table-row-${i.asset}`}
                                        className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                        onClick={
                                            () => {}
                                            // openDialog('borrow-asset-dialog', {
                                            //     ...i,
                                            //     view: 'Repay',
                                            // })
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
                                                value={`${i.amountNative} ${
                                                    width > 600 ? i.asset : ''
                                                }`}
                                                dollar={i.amountUsd}
                                                size="xs"
                                                color="text-brand-black"
                                            />
                                        </td>
                                        <td>
                                            <Button label="Claim" primary />
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            ) : (
                <span className="flex justify-center text-center py-12 lg:py-16">
                    No Rewards Available
                </span>
            )}
        </Card>
    );
};

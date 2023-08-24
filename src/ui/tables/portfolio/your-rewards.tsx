import React from 'react';
import { AssetDisplay, NumberAndDollar } from '../../components/displays';
import { useWindowSize } from '../../../hooks';
import { Button, Card } from '../../components';
import { useNetwork, useSigner } from 'wagmi';
import { SDK_PARAMS } from '../../../utils/constants';
import { claimExternalRewards } from '@vmexfinance/sdk';

export type IYourRewardsTableItemProps = {
    asset: string;
    amountUsd: string;
    amountNative: string;
    token: string;
    proof: string[];
    amountWei: string;
};

export type IYourRewardsTableProps = {
    data: IYourRewardsTableItemProps[];
    isLoading: boolean;
    address: string;
};

export const YourRewardsTable: React.FC<IYourRewardsTableProps> = ({
    data,
    isLoading,
    address,
}) => {
    const { width } = useWindowSize();
    const headers = ['Asset', 'Amount', ''];
    const { data: signer } = useSigner();
    const { chain } = useNetwork();

    const onClaim = async (
        account: string,
        rewardToken: string,
        amountWei: string,
        proof: string[],
    ) => {
        if (!signer || !chain) return;
        console.log(account, rewardToken, amountWei, proof);
        const tx = await claimExternalRewards(
            signer,
            chain?.network,
            account,
            rewardToken,
            amountWei,
            proof,
            false,
            SDK_PARAMS.providerRpc,
        );
        await tx.wait();
    };

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
                            data.map((reward) => {
                                return (
                                    <tr
                                        key={`reward-table-row-${reward.token}`}
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
                                                name={width > 600 ? reward.asset : ''}
                                                logo={`/coins/${reward.token}.svg`}
                                            />
                                        </td>
                                        <td>
                                            <NumberAndDollar
                                                value={reward.amountNative}
                                                dollar={reward.amountUsd}
                                                size="xs"
                                                color="text-brand-black"
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                label="Claim"
                                                primary
                                                onClick={() =>
                                                    onClaim(
                                                        address,
                                                        reward.token,
                                                        reward.amountWei,
                                                        reward.proof,
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            ) : (
                <span className="flex justify-center text-center py-12">No Rewards Available</span>
            )}
        </Card>
    );
};

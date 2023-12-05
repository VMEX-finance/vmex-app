import React from 'react';
import { useModal, useWindowSize } from '@/hooks';
import { Button, Card, AssetDisplay, NumberAndDollar } from '@/ui/components';
import { useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { DEFAULT_NETWORK, NETWORKS, getNetworkName } from '@/utils';
import { claimExternalRewards } from '@vmexfinance/sdk';

export type IYourRewardsTableItemProps = {
    asset: string;
    amountUsd: string;
    amountNative: string;
    claimableAmountNative: string;
    token: string;
    proof: string[];
    amountWei: string;
    claimableAmountWei: string;
    chainId?: number;
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
    const network = getNetworkName();
    const { width } = useWindowSize();
    const headers = ['Asset', 'Amount', ''];
    const { data: signer } = useSigner();
    const { chain } = useNetwork();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { submitTx } = useModal();

    const handleClaim = async (
        account: string,
        rewardToken: string,
        amountWei: string,
        proof: string[],
        chainId?: number,
    ) => {
        if (data && signer) {
            if (chainId !== chain?.id && switchNetworkAsync) await switchNetworkAsync(chainId);
            await submitTx(async () => {
                const tx = await claimExternalRewards(
                    signer,
                    chain?.network || DEFAULT_NETWORK,
                    account,
                    rewardToken,
                    amountWei,
                    proof,
                    false,
                    NETWORKS[network].rpc,
                );
                return tx;
            });
        }
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
                                        className="text-left transition duration-150 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                        onClick={
                                            () => {}
                                            // openDialog('borrow-asset-dialog', {
                                            //     ...i,
                                            //     view: 'Repay',
                                            // })
                                        }
                                    >
                                        <td className="whitespace-nowrap pl-4 py-2 text-sm sm:pl-6">
                                            <AssetDisplay
                                                name={width > 600 ? reward.asset : ''}
                                                logo={`/coins/${reward.token}.svg`}
                                            />
                                        </td>
                                        <td>
                                            <NumberAndDollar
                                                value={reward.claimableAmountNative}
                                                dollar={reward.amountUsd}
                                                size="xs"
                                                color="text-brand-black"
                                            />
                                        </td>
                                        <td>
                                            <div className="h-full w-full flex justify-end items-center">
                                                <Button
                                                    type="accent"
                                                    disabled={reward.claimableAmountWei === '0x0'}
                                                    onClick={() =>
                                                        handleClaim(
                                                            address,
                                                            reward.token,
                                                            reward.amountWei,
                                                            reward.proof,
                                                            reward.chainId,
                                                        ) as any
                                                    }
                                                >
                                                    Claim
                                                </Button>
                                            </div>
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

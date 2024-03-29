import React from 'react';
import { NumberDisplay, NumberAndDollar, Card, Button } from '@/ui/components';
import { useDialogController } from '@/hooks';

export type IStakingAsset = {
    title: string;
    asset: string;
    bonus: {
        days: string | number;
        percent: string | number;
    };
    apr: string | number;
    slashing: string | number;
    wallet?: {
        staked?: string | number;
        claim?: string | number;
    };
    data?: any;
};

export const StakingAsset = (props: IStakingAsset) => {
    const { openDialog } = useDialogController();

    return (
        <div className="p-2">
            <div className="flex flex-col">
                <h2 className="text-4xl">{props.title}</h2>
                <div className="grid divide-gray-700 grid-cols-1 divide-y md:grid-cols-2 md:divide-y-0 md:divide-x">
                    <div className="flex flex-col pb-6 md:pb-0 md:pr-6">
                        <span className="mb-6 text-3xl">{props.asset}</span>

                        <div className="flex flex-col gap-1 xl:gap-2">
                            <NumberDisplay
                                color="text-brand-purple"
                                label="Current Staking Bonus"
                                value={`${props.bonus.days} days - ${props.bonus.percent}%`}
                            />

                            <NumberDisplay
                                color="text-brand-purple"
                                label="Staking APR"
                                value={`${props.apr}%`}
                            />

                            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                                <NumberDisplay
                                    color="text-brand-purple"
                                    label="Max Slashing"
                                    value={`${props.slashing}`}
                                />
                                <div className="h-fit">
                                    <Button
                                        className="text-gray-900 dark:text-white"
                                        onClick={() =>
                                            openDialog('stake-asset-dialog', { ...props.data })
                                        }
                                    >{`Stake ${props.asset}`}</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 xl:gap-2 pt-6 md:pt-0 md:pl-6">
                        <span className="text-3xl">Claim VMEX</span>

                        <div className="flex justify-between !items-end">
                            <NumberAndDollar
                                label="Available"
                                value={props.wallet?.staked}
                                dollar={0.0}
                            />
                            <div className="w-fit">
                                <Button type="accent" className="text-gray-900">
                                    Claim VMEX
                                </Button>
                            </div>
                        </div>

                        <span className="text-3xl">Unstake VMEX</span>
                        <div className="flex justify-between !items-end">
                            <NumberAndDollar
                                label="Available"
                                value={props.wallet?.staked}
                                dollar={0.0}
                            />
                            <div className="w-fit">
                                <Button type="accent" className="text-gray-900">
                                    Unstake VMEX
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Card } from '../../components/cards';
import React from 'react';
import { Number, NumberAndDollar } from '../../components/displays';
import { useDialogController } from '../../../hooks/dialogs';
import { Button } from '../../components/buttons';

type IStakingAsset = {
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
        <Card black>
            <div className="flex flex-col">
                <h2 className="text-4xl">Stake</h2>
                <div className="grid divide-neutral-100 grid-cols-1 divide-y md:grid-cols-2 md:divide-y-0 md:divide-x">
                    <div className="flex flex-col pb-6 md:pb-0 md:pr-6">
                        <span className="mb-6 text-3xl">{props.asset}</span>

                        <div className="flex flex-col gap-1 xl:gap-2">
                            <Number
                                color="text-brand-purple"
                                label="Current Staking Bonus"
                                value={`${props.bonus.days} days - ${props.bonus.percent}%`}
                            />

                            <Number
                                color="text-brand-purple"
                                label="Staking APR"
                                value={`${props.apr}%`}
                            />

                            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                                <Number
                                    color="text-brand-purple"
                                    label="Max Slashing"
                                    value={`${props.slashing}`}
                                />
                                <div className="h-fit">
                                    <Button
                                        label={`Stake ${props.asset}`}
                                        onClick={() =>
                                            openDialog('stake-asset-dialog', { ...props.data })
                                        }
                                    />
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
                                <Button
                                    label="Claim VMEX"
                                    className="!bg-black !border-white border !text-white hover:!bg-neutral-800"
                                />
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
                                <Button
                                    label="Unstake VMEX"
                                    className="!bg-black !border-white border !text-white hover:!bg-neutral-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

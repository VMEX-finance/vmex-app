import React from 'react';
import { Card } from '../../components/cards/default';

export type IStakingOverviewProps = {
    safetyFunds: string | number;
    dailyEmissions: string | number;
    stakers: string | number;
    etc: string | number;
};

export const StakingOverview = (props: IStakingOverviewProps) => {
    const stats = [
        {
            label: 'Funds in Safety Module',
            amount: props.safetyFunds,
        },
        {
            label: 'Avg. Daily Emissions',
            amount: props.dailyEmissions,
        },
        {
            label: 'VMEX Stakers',
            amount: props.stakers,
        },
        {
            label: 'Something will go here',
            amount: props.etc,
        },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-neutral-900 items-center justify-center">
                {stats.map((el, i) => (
                    <div
                        key={`staking-overview-${i}`}
                        className="flex lg:justify-center lg:items-center py-2 first:pt-0 last:pb-0"
                    >
                        <div className="flex flex-col">
                            <span className="text-neutral-500">{el.label}</span>
                            <span className="text-4xl">${el.amount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

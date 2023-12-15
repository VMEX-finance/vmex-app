import React from 'react';
import { Card } from '@/ui/components';

export type IStakingOverviewProps = {
    apr: string | number;
    totalLocked: string | number;
    yourLocked: string | number;
    expiration: string | number;
};

export const StakingOverview = (props: IStakingOverviewProps) => {
    const stats = [
        {
            label: 'Max veVMEX lock vAPR',
            amount: props.apr,
        },
        {
            label: 'Total Locked VMEX',
            amount: props.totalLocked,
        },
        {
            label: 'Your Locked VMEX',
            amount: props.yourLocked,
        },
        {
            label: 'Expiration for the lock',
            amount: props.expiration,
        },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-gray-300 dark:divide-gray-700 items-center justify-center">
                {stats.map((el, i) => (
                    <div
                        key={`staking-overview-${i}`}
                        className="flex justify-center lg:items-center py-2 first:pt-0 last:pb-0"
                    >
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-4xl">{el.amount}</span>
                            <span className="text-gray-500">{el.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

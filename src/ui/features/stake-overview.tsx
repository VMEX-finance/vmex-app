import React from 'react';
import { Card, Loader } from '@/ui/components';
import { numberFormatter } from '@/utils';

export type IStakingOverviewProps = {
    apr: string | number;
    totalLocked: string | number;
    yourLocked: string | number;
    expiration: string | number;
    loading?: boolean;
};

export const StakingOverview = (props: IStakingOverviewProps) => {
    const stats = [
        {
            label: 'Max veVMEX lock vAPR',
            amount: props.apr,
        },
        {
            label: 'Total Locked VW8020',
            amount: props.totalLocked,
        },
        {
            label: 'Your Locked VW8020',
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
                            <Loader loading={props.loading} height={40} width={100}>
                                <span className="flex gap-0.5 items-end">
                                    <span className="text-4xl">
                                        {el.label.includes('Locked')
                                            ? numberFormatter.format(Number(el.amount))
                                            : el.amount}
                                    </span>
                                    {el.label === 'Expiration for the lock' &&
                                        el.amount !== '-' && (
                                            <span className="text-xs mb-1 text-gray-600 dark:text-gray-400">
                                                Weeks
                                            </span>
                                        )}
                                </span>
                            </Loader>
                            <span className="text-gray-500">{el.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

import React from 'react';
import { Card, Loader } from '@/ui/components';
import { numberFormatter } from '@/utils';
import { useWindowSize } from '@/hooks';

export type IStakingOverviewProps = {
    apr: string | number;
    totalLocked: string | number;
    yourLocked: string | number;
    expiration: string | number;
    loading?: boolean;
};

export const StakingOverview = (props: IStakingOverviewProps) => {
    const { isBigger } = useWindowSize();
    const stats = [
        {
            label: isBigger('sm') ? 'Max veVMEX lock vAPR' : 'Max veVMEX vAPR',
            amount: props.apr,
        },
        {
            label: isBigger('sm') ? 'Total Locked VW8020' : 'Total Locked',
            amount: props.totalLocked,
        },
        {
            label: isBigger('sm') ? 'Your Locked VW8020' : 'Your Locked',
            amount: props.yourLocked,
        },
        {
            label: isBigger('sm') ? 'Expiration for the lock' : 'Your Expiration',
            amount: props.expiration,
        },
    ];

    return (
        <Card>
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-gray-300 dark:divide-gray-700 items-center justify-center">
                {stats.map((el, i) => (
                    <div
                        key={`staking-overview-${i}`}
                        className="flex justify-center lg:items-center py-2 sm:border-none border-t border-gray-300 dark:border-gray-700 lg:first:pt-0 lg:last:pb-0"
                    >
                        <div className="flex flex-col gap-0.5 sm:gap-1 items-center">
                            <Loader loading={props.loading} height={40} width={100}>
                                <span className="flex gap-0.5 items-end">
                                    <span className="text-3xl sm:text-4xl">
                                        {el.label.includes('Locked')
                                            ? numberFormatter.format(Number(el.amount))
                                            : el.amount}
                                    </span>
                                    {el.label.includes('Expiration') && el.amount !== '-' && (
                                        <span className="text-xs mb-1 text-gray-600 dark:text-gray-400">
                                            Weeks
                                        </span>
                                    )}
                                </span>
                            </Loader>
                            <span className="text-gray-500 text-sm sm:text-md">{el.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

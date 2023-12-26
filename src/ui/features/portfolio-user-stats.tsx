import React from 'react';
import { NumberDisplay, Card } from '@/ui/components';
import { useWindowSize } from '@/hooks';

export interface IPortfolioProps {
    networth?: string;
    supplied?: string | number;
    borrowed?: string | number;
    isLoading?: boolean;
    avgHealth?: string;
    avgApy?: string;
    healthLoading?: boolean;
}

export const PortfolioStatsCard: React.FC<IPortfolioProps> = ({
    networth,
    supplied,
    borrowed,
    isLoading,
    avgHealth,
    avgApy,
    healthLoading,
}) => {
    const { isBigger } = useWindowSize();
    return (
        <Card>
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black dark:divide-white">
                <div className="grid grid-cols-2 md:grid-cols-1 font-basefont gap-4 items-end lg:items-center">
                    <NumberDisplay
                        label={isBigger('sm') ? 'Protocol Net Worth' : 'Net Worth'}
                        value={networth || '-'}
                        loading={isLoading}
                        labelClass="text-2xl"
                        size="xl"
                    />
                    <div className="md:hidden">
                        <NumberDisplay
                            size="xl"
                            label="Average APY"
                            value={`${parseFloat(avgApy || '0').toFixed(3)}%`}
                            loading={isLoading}
                        />
                    </div>
                </div>

                <div className="py-2 md:py-4 kg:py-0 lg:pl-6 grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:col-span-3 xl:col-span-4">
                    <NumberDisplay
                        size="xl"
                        label="Total Supplied"
                        value={supplied || '-'}
                        loading={isLoading}
                    />

                    <NumberDisplay
                        size="xl"
                        label="Total Borrowed"
                        value={borrowed || '-'}
                        loading={isLoading}
                    />

                    {/* <NumberDisplay
                        size="xl"
                        label="Average Health"
                        value={`${parseFloat(avgHealth || '0').toFixed(1)}`}
                        loading={healthLoading || isLoading}
                        color={determineHealthColor(avgHealth)}
                    /> */}
                    <div className="hidden md:block">
                        <NumberDisplay
                            size="xl"
                            label="Average APY"
                            value={`${parseFloat(avgApy || '0').toFixed(3)}%`}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

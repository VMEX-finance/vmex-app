import React from 'react';
import { NumberDisplay, Card } from '@/ui/components';

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
    return (
        <Card>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black dark:divide-white">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[200px]">
                        <NumberDisplay
                            label="Protocol Net Worth"
                            value={networth || '-'}
                            loading={isLoading}
                            labelClass="text-2xl"
                            size="xl"
                        />
                    </div>
                </div>

                <div className="py-2 md:py-4 xl:py-0 xl:pl-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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

                    <NumberDisplay
                        size="xl"
                        label="Average APY"
                        value={`${parseFloat(avgApy || '0').toFixed(3)}%`}
                        loading={isLoading}
                    />
                </div>
            </div>
        </Card>
    );
};
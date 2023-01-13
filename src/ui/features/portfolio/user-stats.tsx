import React from 'react';
import { NumberDisplay, Card } from '../../components';

export interface IPortfolioProps {
    networth?: string;
    supplied?: string | number;
    borrowed?: string | number;
    isLoading?: boolean;
    avgHealth?: string;
}

export const PortfolioStatsCard: React.FC<IPortfolioProps> = ({
    networth,
    supplied,
    borrowed,
    isLoading,
    avgHealth,
}) => {
    return (
        <Card>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black dark:divide-white">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <NumberDisplay
                            label="Total Net Worth"
                            value={networth || '-'}
                            loading={isLoading}
                            labelClass="text-2xl"
                            size="xl"
                        />
                    </div>
                </div>

                <div className="py-2 md:py-4 xl:py-0 xl:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Supplied"
                            value={supplied || '-'}
                            loading={isLoading}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <NumberDisplay
                            size="xl"
                            label="Total Borrowed"
                            value={borrowed || '-'}
                            loading={isLoading}
                        />
                    </div>

                    <div>
                        <NumberDisplay
                            size="xl"
                            label="Average Health Factor"
                            value={parseFloat(avgHealth || '0') < 100 ? avgHealth : '0'}
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

import React from 'react';
import { Card } from '../../components/cards';
import { useWindowSize } from '../../../hooks/ui';
import { HealthFactor, NumberDisplay } from '../../components/displays';

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
    const { width } = useWindowSize();

    return (
        <Card loading={isLoading}>
            <div className="flex flex-col xl:flex-row gap-2 md:gap-4 xl:gap-6 divide-y-2 xl:divide-y-0 xl:divide-x-2 divide-black">
                <div className="flex flex-col md:flex-row font-basefont gap-8">
                    <div className="flex flex-col justify-between min-w-[90%] xl:min-w-[300px]">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Total Net Worth</h2>
                            <p className="text-3xl">{networth || '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="py-2 md:py-4 xl:py-0 xl:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <NumberDisplay size="xl" label="Total Supplied" value={supplied || '-'} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <NumberDisplay size="xl" label="Total Borrowed" value={borrowed || '-'} />
                    </div>

                    <div>
                        <NumberDisplay
                            size="xl"
                            label="Average Health Factor"
                            value={
                                <HealthFactor
                                    size="lg"
                                    value={parseFloat(avgHealth || '0') < 100 ? avgHealth : '0'}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
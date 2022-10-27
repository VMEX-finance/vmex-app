import { Card } from '../../components/cards';
import React from 'react';
import { MultipleAssetsDisplay, NumberDisplay } from '../../components/displays';

export interface ITrancheTVLData {
    assets?: string[];
    tvl?: number;
    supplied?: number;
    sYtd?: number;
    borrowed?: number;
    bYtd?: number;
    grade?: string;
}

const TrancheTVLDataCard: React.FC<ITrancheTVLData> = ({
    assets,
    tvl,
    supplied,
    sYtd,
    bYtd,
    borrowed,
    grade,
}) => {
    return (
        <Card>
            {/* TODO: use number display component to maintain consistency */}
            <div
                className="flex flex-col flow md:flex-row justify-between font-basefont gap-8"
                style={{ flexFlow: 'wrap' }}
            >
                <div className="flex flex-col justify-between order-1">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl">Assets</h2>
                        <MultipleAssetsDisplay assets={assets} />
                    </div>
                </div>
                <div className="flex flex-wrap justify-around md:justify-between items-center gap-2 md:gap-12 lg:gap-36 order-3 md:order-2">
                    <NumberDisplay center size="xl" label="TVL" value={`$${tvl}M`} change={3.86} />
                    <NumberDisplay
                        center
                        size="xl"
                        label="Supplied"
                        value={`$${supplied}M`}
                        change={3.86}
                    />
                    <NumberDisplay
                        center
                        size="xl"
                        label="Borrowed"
                        value={`$${borrowed}M`}
                        change={-1.29}
                    />
                </div>
                <div className="order-2 md:order-3">
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Grade</h2>
                            <p className="text-3xl">{grade}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export { TrancheTVLDataCard };

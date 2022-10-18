import { Card } from '../../components/cards';
import React from 'react';
import { MultipleAssetsDisplay, Number } from '../../components/displays';

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
            <div className="flex flex-col md:flex-row justify-between font-basefont gap-8">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl">Assets</h2>
                        <MultipleAssetsDisplay assets={assets} />
                    </div>
                </div>
                <div className="flex justify-between items-center gap-36">
                    <Number center size="xl" label="TVL" value={`$${tvl}M`} />
                    <Number center size="xl" label="Supplied" value={`$${supplied}M`} />
                    <Number center size="xl" label="Borrowed" value={`$${borrowed}M`} />
                </div>
                <div>
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

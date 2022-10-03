import { Card } from '../../components/cards';
import React from 'react';
import { ReLineChart } from '../../components/charts';
import { lineData2 } from '../../../utils/mock-data';

export interface ITrancheTVLData {
    assets?: string | string[]
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
    grade
}) => {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
    });
    return (
        <Card >
            <div className="flex flex-col md:flex-row justify-between font-basefont gap-8">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-2xl">Assets</h2>
                        <p className="text-3xl">{tvl ? formatter.format(tvl as number) : ''}</p>
                    </div>
                </div>
                <div className="flex md:flex-row justify-between gap-36">
                    <div className="flex flex-col">
                        <p className="text-sm">TVL</p>
                        <p className="text-xl">
                        {tvl ? formatter.format(tvl as number) : ''}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="odd:text-sm">Supplied</p>
                        <p className="text-xl text-brand-green">{supplied}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Borrowed</p>
                        <p className="text-xl text-brand-purple">{borrowed}</p>
                    </div>
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


import { Card } from '../ui/components/cards';
import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/components/tables';
import { DropdownButton } from '../ui/components/buttons';
import { _mockTranchesData } from '../utils/mock-data';

const Tranches: React.FC = () => {
    return (
        <AppTemplate title="tranches">
            <Card>
                <p className="text-xl -mt-4 pb-5">All Available Tranches</p>
                <div className="divide-x-8 divide-transparent">
                    <DropdownButton items={[{ text: 'Filter Asset' }]} primary direction="right" />
                    <DropdownButton items={[{ text: 'Filter APY' }]} primary direction="right" />
                    <DropdownButton items={[{ text: 'Filter TVL' }]} primary direction="right" />
                </div>
                <TranchesTable data={_mockTranchesData} />
            </Card>
        </AppTemplate>
    );
};
export default Tranches;

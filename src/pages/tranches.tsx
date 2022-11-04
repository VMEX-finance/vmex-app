import { Card } from '../ui/components/cards';
import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/components/tables';
import { DropdownButton } from '../ui/components/buttons';
import { _mockTranchesData } from '../utils/mock-data';
import { TranchesTableDos } from '../ui/components/tables/tranches2';
const Tranches: React.FC = () => {
    return (
        <AppTemplate title="tranches">
            {/*<TranchesTable data={_mockTranchesData} /> */}
            <TranchesTableDos data={_mockTranchesData} />
        </AppTemplate>
    );
};
export default Tranches;

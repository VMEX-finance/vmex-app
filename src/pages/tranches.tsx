import React from 'react';
import { AppTemplate } from '../ui/templates';
import { _mockTranchesData } from '../utils/mock-data';
import { TranchesTable } from '../ui/components/tables';

const Tranches: React.FC = () => {
    return (
        <AppTemplate title="tranches">
            <TranchesTable data={_mockTranchesData} />
        </AppTemplate>
    );
};
export default Tranches;

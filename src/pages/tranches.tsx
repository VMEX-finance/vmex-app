import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MOCK_TRANCHES_DATA } from '../utils/mock-data';
import { TranchesTable } from '../ui/tables';

const Tranches: React.FC = () => {
    return (
        <AppTemplate title="tranches">
            <TranchesTable data={MOCK_TRANCHES_DATA} />
        </AppTemplate>
    );
};
export default Tranches;

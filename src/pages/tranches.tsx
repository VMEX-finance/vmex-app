import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/tables';
import { useTranchesData } from '../api/protocol';

const Tranches: React.FC = () => {
    const { queryAllTranches } = useTranchesData();

    return (
        <AppTemplate title="tranches">
            <TranchesTable data={queryAllTranches.data} />
        </AppTemplate>
    );
};
export default Tranches;

import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/tables';
import { useSubgraphTranchesOverviewData } from '../api/subgraph';

const Tranches: React.FC = () => {
    const { queryAllTranches } = useSubgraphTranchesOverviewData();
    return (
        <AppTemplate title="tranches">
            <TranchesTable data={queryAllTranches.data} loading={queryAllTranches.isLoading} />
        </AppTemplate>
    );
};
export default Tranches;

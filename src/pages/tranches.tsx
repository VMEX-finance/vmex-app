import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/tables';
import { useAccount } from 'wagmi';
import { useSubgraphTranchesOverviewData, useUserData } from '../api';

const Tranches: React.FC = () => {
    const { address } = useAccount();
    const { queryAllTranches } = useSubgraphTranchesOverviewData();
    const { queryUserActivity } = useUserData(address);

    return (
        <AppTemplate title="tranches">
            <TranchesTable
                data={queryAllTranches.data}
                loading={queryAllTranches.isLoading}
                userActivity={queryUserActivity}
            />
        </AppTemplate>
    );
};
export default Tranches;

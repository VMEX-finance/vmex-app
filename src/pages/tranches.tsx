import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/tables';
import { useTranchesPageQuery } from '../api';
import { useAccount } from 'wagmi';

const Tranches: React.FC = () => {
    const { address } = useAccount();
    const { queryAllTranches, queryUserActivity } = useTranchesPageQuery(address);
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

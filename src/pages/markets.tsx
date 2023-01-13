import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/tables';
import { useSubgraphAllMarketsData } from '../api/subgraph';
import { useAccount } from 'wagmi';
import { useUserData } from '../api';

const Markets: React.FC = () => {
    const { address } = useAccount();
    const { queryUserActivity } = useUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    return (
        <AppTemplate title="markets">
            <MarketsTable
                data={queryAllMarketsData.data}
                loading={queryAllMarketsData.isLoading}
                userActivity={queryUserActivity}
            />
        </AppTemplate>
    );
};
export default Markets;

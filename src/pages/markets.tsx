import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/tables';
import { useSubgraphAllMarketsData } from '../api/subgraph';
import { useAccount } from 'wagmi';
import { useUserData } from '../api';
import useAnalyticsEventTracker from '../utils/google-analytics';

const Markets: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Markets');
    const { address } = useAccount();
    const { queryUserActivity } = useUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    console.log('markets data', queryAllMarketsData.data);

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

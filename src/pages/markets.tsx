import React from 'react';
import { Base } from '@/ui/base';
import { MarketsTable } from '@/ui/tables';
import { useSubgraphAllMarketsData, useUserData } from '@/api';
import { useAccount } from 'wagmi';
import { useAnalyticsEventTracker } from '@/config';

const Markets: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Markets');
    const { address } = useAccount();
    const { queryUserActivity } = useUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();
    return (
        <Base title="markets">
            <div className="shadow-md shadow-gray-300 dark:shadow-neutral-950">
                <MarketsTable
                    data={queryAllMarketsData.data}
                    loading={queryAllMarketsData.isLoading}
                    userActivity={queryUserActivity}
                />
            </div>
        </Base>
    );
};
export default Markets;

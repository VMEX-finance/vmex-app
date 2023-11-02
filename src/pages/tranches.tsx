import React from 'react';
import { Base } from '@/ui/base';
import { TranchesTable } from '@/ui/tables';
import { useAccount } from 'wagmi';
import { useSubgraphTranchesOverviewData, useUserData } from '@/api';
import { ITrancheProps } from '@/api';
import { useAnalyticsEventTracker } from '@/config';

const Tranches: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker(`Tranches`);
    const { address } = useAccount();
    const { queryAllTranches } = useSubgraphTranchesOverviewData();
    const { queryUserActivity } = useUserData(address);

    return (
        <Base title="tranches">
            <TranchesTable
                data={queryAllTranches.data?.filter(
                    (el: ITrancheProps) => el.assets && el.assets.length > 0,
                )}
                loading={queryAllTranches.isLoading}
                userActivity={queryUserActivity}
            />
        </Base>
    );
};
export default Tranches;

import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/tables';
import { useAccount, useNetwork } from 'wagmi';
import { useSubgraphTranchesOverviewData, useUserData } from '../api';
import { ITrancheProps } from '@app/api/types';
import { WalletButton } from '../ui/components';

const Tranches: React.FC = () => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { queryAllTranches } = useSubgraphTranchesOverviewData();
    const { queryUserActivity } = useUserData(address);

    return (
        <AppTemplate title="tranches">
            <TranchesTable
                data={queryAllTranches.data?.filter(
                    (el: ITrancheProps) => el.assets && el.assets.length > 0,
                )}
                loading={queryAllTranches.isLoading}
                userActivity={queryUserActivity}
            />
            {(chain?.unsupported as any) && (
                <div className="mt-10 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg dark:text-neutral-200">
                            Please switch networks.
                        </span>
                    </div>
                    <WalletButton primary className="w-fit" />
                </div>
            )}
        </AppTemplate>
    );
};
export default Tranches;

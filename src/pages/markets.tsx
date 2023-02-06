import React from 'react';
import { AppTemplate } from '../ui/templates';
import { MarketsTable } from '../ui/tables';
import { useSubgraphAllMarketsData } from '../api/subgraph';
import { useAccount, useNetwork } from 'wagmi';
import { useUserData } from '../api';
import { WalletButton } from '../ui/components';

const Markets: React.FC = () => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { queryUserActivity } = useUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    return (
        <AppTemplate title="markets">
            <MarketsTable
                data={queryAllMarketsData.data}
                loading={queryAllMarketsData.isLoading}
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
export default Markets;

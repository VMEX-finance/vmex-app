import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { ProtocolStatsCard, UserPerformanceCard } from '../ui/features/overview';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { useUserData } from '../api/user';
import { useWalletState } from '../hooks/wallet';

const Portfolio: React.FC = () => {
    const { address } = useWalletState();
    const { queryUserPerformance, queryUserActivity } = useUserData(address);

    return (
        <AppTemplate title="Portfolio">
            {address ? (
                <GridView type="fixed">
                    <div className="col-span-2 flex flex-col gap-4 md:gap-6 lg:gap-8">
                        {/* <ProtocolStatsCard /> */}
                        <div className="flex flex-col lg:flex-row lg:grow gap-4 md:gap-6 lg:gap-8">
                            <YourPositionsTable
                                type="supplies"
                                data={queryUserActivity.data?.supplies}
                                isLoading={queryUserActivity.isLoading}
                            />
                            <YourPositionsTable
                                type="borrows"
                                data={queryUserActivity.data?.borrows}
                                isLoading={queryUserActivity.isLoading}
                            />
                        </div>
                    </div>
                    <div className="col-span-2 2xl:col-span-1">
                        <UserPerformanceCard
                            {...queryUserPerformance.data}
                            isLoading={queryUserPerformance.isLoading}
                        />
                    </div>
                </GridView>
            ) : (
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">Please connect your wallet.</span>
                    </div>
                    <WalletButton />
                </div>
            )}
        </AppTemplate>
    );
};
export default Portfolio;

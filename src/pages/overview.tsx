import React, { useEffect } from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { UserPerformanceCard, ProtocolStatsCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { RainbowWalletButton } from '../ui/components/buttons';
import { useProtocolData } from '../api/protocol';
import { useUserData } from '../api/user';
import { useAccount } from 'wagmi';
import { useWalletState } from '../hooks/wallet';
const Overview: React.FC = () => {
    // const { address } = useWalletState2();
    const { isConnected } = useAccount();
    const { queryProtocolOverview } = useProtocolData();
    const { queryUserPerformance, queryUserActivity } = useUserData(address);

    return (
        <AppTemplate title="overview">
            <ProtocolStatsCard
                {...queryProtocolOverview.data}
                isLoading={queryProtocolOverview.isLoading}
            />
            {isConnected ? (
                <GridView type="fixed">
                    <UserPerformanceCard
                        {...queryUserPerformance.data}
                        isLoading={queryUserPerformance.isLoading}
                    />
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
                </GridView>
            ) : (
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">Please connect your wallet.</span>
                    </div>
<<<<<<< HEAD
                    <RainbowWalletButton primary />
=======
                    <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
>>>>>>> 5961c17 (add Rainbow Wallet)
                </div>
            )}
        </AppTemplate>
    );
};
export default Overview;

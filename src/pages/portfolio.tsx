import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { PortfolioStatsCard, UserPerformanceCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { Button, WalletButton } from '../ui/components/buttons';
import { useUserData, useUserTranchesData } from '../api/user';
import { useAccount, useNetwork } from 'wagmi';
import { addDollarAmounts, bigNumberToUnformattedString } from '../utils/sdk-helpers';
import { useSubgraphUserData } from '../api/subgraph';
import { averageOfArr, numberFormatter } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useMyTranchesContext } from '../store/my-tranches';

const Portfolio: React.FC = () => {
    const navigate = useNavigate();

    const { address } = useAccount();
    const { chain } = useNetwork();
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    // const { myTranches } = useMyTranchesContext();
    const { queryUserActivity } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address);
    const { queryUserTranchesData } = useUserTranchesData(address);

    const calculateNetworth = () => {
        let sum = 0;
        sum =
            (addDollarAmounts(
                queryUserActivity.data?.supplies.map((el) => el.amount),
                false,
            ) as number) -
            (addDollarAmounts(
                queryUserActivity.data?.borrows.map((el) => el.amount),
                false,
            ) as number);
        return `$${sum ? sum.toFixed(2) : '0.00'}`;
    };

    const caculateAvgHealth = () => {
        if (queryUserTranchesData.isLoading || !queryUserTranchesData.data) return '0';
        else {
            const allHealths = queryUserTranchesData.data.map((tranche) =>
                parseFloat(tranche.healthFactor),
            );
            return averageOfArr(allHealths).toString();
        }
    };

    return (
        <AppTemplate
            title="Portfolio"
            right={
                <Button
                    primary
                    label="My Tranches"
                    disabled={queryTrancheAdminData.data?.length === 0}
                    onClick={() => navigate(`/my-tranches`)}
                />
            }
        >
            {address && !chain?.unsupported ? (
                <GridView type="fixed">
                    <div className="col-span-2 flex flex-col gap-4 xl:gap-8">
                        <PortfolioStatsCard
                            isLoading={queryUserActivity.isLoading}
                            networth={calculateNetworth()}
                            supplied={addDollarAmounts(
                                queryUserActivity.data?.supplies.map((el) => el.amount),
                            )}
                            borrowed={addDollarAmounts(
                                queryUserActivity.data?.borrows.map((el) => el.amount),
                            )}
                            avgHealth={caculateAvgHealth()}
                            healthLoading={queryUserTranchesData.isLoading}
                            avgApy={queryUserActivity.data?.avgApy.toString()}
                        />
                        <div className="flex flex-col lg:flex-row lg:grow gap-4 xl:gap-8">
                            <YourPositionsTable
                                type="supplies"
                                data={queryUserActivity.data?.supplies}
                                isLoading={queryUserActivity.isLoading}
                                withHealth
                                healthLoading={queryUserTranchesData.isLoading}
                            />
                            <YourPositionsTable
                                type="borrows"
                                data={queryUserActivity.data?.borrows}
                                isLoading={queryUserActivity.isLoading}
                                withHealth
                                healthLoading={queryUserTranchesData.isLoading}
                            />
                        </div>
                    </div>
                    <div className="col-span-2 2xl:col-span-1">
                        <UserPerformanceCard
                            isLoading={queryUserActivity.isLoading || queryUserPnlChart.isLoading}
                            loanedAssets={queryUserActivity.data?.supplies?.map((el) => ({
                                asset: el.asset,
                                amount: numberFormatter.format(
                                    parseFloat(
                                        bigNumberToUnformattedString(el.amountNative, el.asset),
                                    ),
                                ),
                            }))}
                            tranches={queryUserActivity.data?.tranchesInteractedWith}
                            profitLossChart={queryUserPnlChart.data || []}
                        />
                    </div>
                </GridView>
            ) : (
                <div className="mt-10 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg dark:text-neutral-200">
                            Please connect your wallet.
                        </span>
                    </div>
                    <WalletButton primary className="!w-fit" />
                </div>
            )}
        </AppTemplate>
    );
};
export default Portfolio;

import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { PortfolioStatsCard, UserPerformanceCard } from '../ui/features';
import { YourPositionsTable } from '../ui/tables';
import { WalletButton } from '../ui/components/buttons';
import { useUserData } from '../api/user';
import { useAccount } from 'wagmi';
import { addDollarAmounts, bigNumberToUnformattedString } from '../utils/sdk-helpers';
import { useSubgraphUserData } from '../api/subgraph';
import { numberFormatter } from '../utils/helpers';

const Portfolio: React.FC = () => {
    const { address } = useAccount();
    const { queryUserActivity } = useUserData(address);
    const { queryUserPnlChart } = useSubgraphUserData(address);

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

    return (
        <AppTemplate title="Portfolio">
            {address ? (
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
                            avgHealth={'0'} // TODO: add average health factor
                        />
                        <div className="flex flex-col lg:flex-row lg:grow gap-4 xl:gap-8">
                            <YourPositionsTable
                                type="supplies"
                                data={queryUserActivity.data?.supplies}
                                isLoading={queryUserActivity.isLoading}
                                withHealth
                            />
                            <YourPositionsTable
                                type="borrows"
                                data={queryUserActivity.data?.borrows}
                                isLoading={queryUserActivity.isLoading}
                                withHealth
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
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">Please connect your wallet.</span>
                    </div>
                    <WalletButton primary className="w-fit" />
                </div>
            )}
        </AppTemplate>
    );
};
export default Portfolio;

import React from 'react';
import { AppTemplate } from '@/ui/templates';
import { ProtocolStatsCard } from '@/ui/features';
import { Carousel } from '@/ui/components';
import { useSubgraphAllMarketsData, useSubgraphProtocolData } from '../api';
import useAnalyticsEventTracker from '../utils/google-analytics';

const Overview: React.FC = () => {
    const gaEventTracker = useAnalyticsEventTracker('Overview');
    const { queryProtocolTVLChart, queryProtocolData } = useSubgraphProtocolData();
    const { queryAllMarketsData } = useSubgraphAllMarketsData();

    return (
        <AppTemplate title="overview">
            <ProtocolStatsCard
                tvl={queryProtocolData.data?.tvl}
                tvlChart={queryProtocolTVLChart}
                reserve={queryProtocolData.data?.reserve}
                lenders={queryProtocolData.data?.uniqueLenders}
                borrowers={queryProtocolData.data?.uniqueBorrowers}
                markets={queryProtocolData.data?.markets}
                totalBorrowed={queryProtocolData.data?.totalBorrowed}
                totalSupplied={queryProtocolData.data?.totalSupplied}
                topBorrowedAssets={queryProtocolData.data?.topBorrowedAssets}
                topSuppliedAssets={queryProtocolData.data?.topSuppliedAssets}
                topTranches={queryProtocolData.data?.topTranches}
                isLoading={queryProtocolData.isLoading}
            />
            <Carousel
                type="strategies"
                items={queryAllMarketsData.data
                    ?.sort((a, b) => Number(b.supplyApy) - Number(a.supplyApy))
                    .slice(0, 10)}
            />
        </AppTemplate>
    );
};
export default Overview;

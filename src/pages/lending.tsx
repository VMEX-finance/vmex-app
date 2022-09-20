import { useMarketOverview } from "../hooks/markets";
import React from "react";
import { AppTemplate, GridView } from "../ui/templates";
import { Card } from "../ui/components/cards";
import TVLDataComponent from "../ui/components/data/TvlData";
import { LendingPerformanceCard, AssetExposureCard, AvailableLiquidityCard } from "../ui/features/lending";

const Lending: React.FC = () => {
    const { TVLDataProps } = useMarketOverview();

    return (
        <AppTemplate title="lending">
            <Card>
                <TVLDataComponent {...TVLDataProps()}/>
            </Card>
            <GridView>
                <LendingPerformanceCard />
                <AvailableLiquidityCard />
                <AssetExposureCard />
            </GridView>
        </AppTemplate>
    )
}
export default Lending;

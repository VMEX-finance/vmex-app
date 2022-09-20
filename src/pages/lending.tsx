import React from "react";
import { AppTemplate, GridView } from "@ui/templates";
import AssetExposureCard from "@ui/features/lending/AssetExposureCard";
import { Card } from "@ui/components/cards";
import TVLDataComponent from "@ui/components/data/TvlData";
import { useMarketOverview } from "@hooks/markets";
import { LendingPerformanceCard } from "@ui/features/lending";
import AvailableLiquidityCard from "@ui/features/lending/AvailableLiquidityCard";

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

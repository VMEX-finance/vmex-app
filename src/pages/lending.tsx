import React from "react";
import AppTemplate from "../templates/app-template";
import MarketLiquidityHero from "../features/heros/MarketLiquidityHero";
import AvailableLiquidityCard from "../features/lending/AvailableLiquidityCard";
import LendingPerformanceCard from "../features/lending/LendingPerformanceCard";
import AssetExposureCard from "../features/lending/AssetExposureCard";
import GridView from "../templates/grid-template";

const Lending: React.FC = () => {
    return (
        <AppTemplate title="lending">
            <MarketLiquidityHero />
            <GridView>
                <LendingPerformanceCard />
                <AvailableLiquidityCard />
                <AssetExposureCard />
            </GridView>
        </AppTemplate>
    )
}
export default Lending;

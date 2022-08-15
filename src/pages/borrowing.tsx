import React from "react";
import AppTemplate from "../templates/app-template";
import AvailableLiquidityCard from "../features/lending/AvailableLiquidityCard";
import LendingPerformanceCard from "../features/lending/LendingPerformanceCard";
import AssetExposureCard from "../features/lending/AssetExposureCard";
import GridView from "../templates/grid-template";

const Borrowing: React.FC = () => {
    return (
        <AppTemplate title="borrowing">
            <GridView>
                <LendingPerformanceCard />
                <AvailableLiquidityCard />
                <AssetExposureCard />
            </GridView>
        </AppTemplate>
    )
}
export default Borrowing;

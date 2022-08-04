import React from "react";
import TVLDataComponent from "../../components/Data/TvlDataComponent";
import useMarketOverview from "./hooks/getMarketOverview";

const MarketLiquidityHero: React.FC = () => {
    const { TVLDataProps } = useMarketOverview()
    return (
        <div className="w-full rounded-lg bg-white">
            <TVLDataComponent {...TVLDataProps()}/>
        </div>
    )
}

export default MarketLiquidityHero;
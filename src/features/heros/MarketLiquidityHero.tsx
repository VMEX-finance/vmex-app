import React from "react";
import TVLDataComponent from "../../components/data/TvlDataComponent";
import useMarketOverview from "../../hooks/markets/getMarketOverview";

const MarketLiquidityHero: React.FC = () => {
    const { TVLDataProps } = useMarketOverview()
    return (
        <div className="w-full rounded-lg bg-white">
            <TVLDataComponent {...TVLDataProps()}/>
        </div>
    )
}

export default MarketLiquidityHero;
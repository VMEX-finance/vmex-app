import { Card } from "../../components/cards/default";
import React from "react";
import TVLDataComponent from "../../components/data/TvlDataComponent";
import useMarketOverview from "../../hooks/markets/getMarketOverview";

const MarketLiquidityHero: React.FC = () => {
    const { TVLDataProps } = useMarketOverview()
    return (
        <Card>
            <TVLDataComponent {...TVLDataProps()}/>
        </Card>
    )
}

export default MarketLiquidityHero;
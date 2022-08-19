import React from "react";
import { Card } from "../../components/cards/default";
import AvailableLiquidityTable from "../../components/tables/AvailableLiquidityTable";
import { _mockAssetData } from "../../models/available-liquidity-model";

const AvailableLiquidityCard: React.FC = () => {
    return (
        <Card>
            <h3 className="text-lg mb-8">Available Liquidity</h3>
            <div>
                <AvailableLiquidityTable data={_mockAssetData.data}/>
            </div>
        </Card>
    )
}

export default AvailableLiquidityCard;
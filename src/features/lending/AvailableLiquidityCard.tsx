import React from "react";
import AvailableLiquidityTable from "../../components/tables/AvailableLiquidityTable";
import { _mockAssetData } from "../../models/available-liquidity-model";

const AvailableLiquidityCard: React.FC = () => {
    return (
        <div className="font-basefont bg-white p-8 rounded-lg">
            <h3 className="text-lg mb-8">Available Liquidity</h3>
            <div>
                <AvailableLiquidityTable data={_mockAssetData.data}/>
            </div>
        </div>
    )
}

export default AvailableLiquidityCard;
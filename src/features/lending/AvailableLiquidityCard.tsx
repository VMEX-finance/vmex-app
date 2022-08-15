import React from "react";
import { Tab } from "@headlessui/react";
import AvailableLiquidityTable from "../../components/tables/AvailableLiquidityTable";
import { _mockAssetData } from "../../models/available-liquidity-model";

const AvailableLiquidityCard: React.FC = () => {
    return (
        <div className="font-basefont bg-white p-8 rounded-lg">
            <header className="text-lg mb-8">Available Liquidity</header>
            <main>
                <AvailableLiquidityTable data={_mockAssetData.data}/>
            </main>
        </div>
    )
}

export default AvailableLiquidityCard;
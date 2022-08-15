import React from "react";
import BorrowedAssetsTable from "../../components/tables/BorrowedAssetsTable";
import { _mockAssetData } from "../../models/available-liquidity-model";

const BorrowedAssetsCard: React.FC = () => {
    return (
        <div className="font-basefont bg-white p-8 rounded-lg">
            <h3 className="text-lg mb-8">Borrowed Assets</h3>
            <div>
                <BorrowedAssetsTable data={_mockAssetData.data}/>
            </div>
        </div>
    )
}

export default BorrowedAssetsCard;
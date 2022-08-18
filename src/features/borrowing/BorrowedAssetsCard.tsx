import React from "react";
import BorrowedAssetsTable from "../../components/tables/BorrowedAssetsTable";
import { _mockAssetData } from "../../models/available-liquidity-model";
import { Card } from "../../components/cards/default";

const BorrowedAssetsCard: React.FC = () => {
    return (
        <Card>
            <h3 className="text-lg mb-8">Borrowed Assets</h3>
            <div>
                <BorrowedAssetsTable data={_mockAssetData.data}/>
            </div>
        </Card>
    )
}

export default BorrowedAssetsCard;
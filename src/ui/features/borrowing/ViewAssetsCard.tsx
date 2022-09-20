import React from "react";
import { ViewBorrowedAssetsTable } from "../../components/tables";
import { _mockAssetData } from "../../../models/available-liquidity-model";
import { Card } from "../../components/cards";

export const ViewBorrowAssetsCard: React.FC = () => {
    return (
        <Card>
            <h3 className="text-lg mb-8">View Assets</h3>
            <div>
                <ViewBorrowedAssetsTable data={_mockAssetData.data}/>
            </div>
        </Card>
    )
}
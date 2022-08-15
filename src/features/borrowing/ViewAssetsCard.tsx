import React from "react";
import ViewBorrowedAssetsTable from "../../components/tables/ViewBorrowedAssetsTable";
import { _mockAssetData } from "../../models/available-liquidity-model";

const ViewBorrowAssetsCard: React.FC = () => {
    return (
        <div className="font-basefont bg-white p-8 rounded-lg">
            <h3 className="text-lg mb-8">View Assets</h3>
            <div>
                <ViewBorrowedAssetsTable data={_mockAssetData.data}/>
            </div>
        </div>
    )
}

export default ViewBorrowAssetsCard;
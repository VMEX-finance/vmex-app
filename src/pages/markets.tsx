import { Card } from "../components/cards/default";
import React from "react";
import AppTemplate from "../templates/app-template";
import MarketsTable from "../components/tables/Markets";
import { _mockMarketsData } from "../models/markets";

const Markets: React.FC = () => {
    return (
        <AppTemplate title="markets">
            <Card>
                <MarketsTable data={_mockMarketsData} />
            </Card>
        </AppTemplate>
    )
}
export default Markets;

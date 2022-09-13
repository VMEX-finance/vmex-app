import { Card } from "../components/cards/default";
import React from "react";
import AppTemplate from "../templates/app-template";
import MarketsTable from "../components/tables/Markets";
import { _mockMarketsData } from "../models/markets";
import TokenData from "../hooks/user-data";
import { ITokenData } from "../store/token-data";

const Markets: React.FC = () => {
    const {
        isLoading,
        error,
        error_msg,
        data
    }: ITokenData = TokenData();
    
    return (
        <AppTemplate title="markets">
            <Card>
                <MarketsTable data={_mockMarketsData} />
            </Card>
        </AppTemplate>
    )
}
export default Markets;

import { Card } from "@ui/components/cards";
import React from "react";
import { AppTemplate } from "@ui/templates";
import { MarketsTable } from "@ui/components/tables";
import { _mockMarketsData } from "../models/markets";
import { TokenData } from "../hooks/user-data";
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

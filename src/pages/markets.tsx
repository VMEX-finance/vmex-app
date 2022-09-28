import { Card } from "../ui/components/cards";
import React from "react";
import { AppTemplate } from "../ui/templates";
import { MarketsTable } from "../ui/components/tables";
import { _mockMarketsData } from "../models/markets";
import { TokenData } from "../hooks/user-data";
import { ITokenData } from "../store/token-data";
import { DropdownButton } from "../ui/components/buttons";

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
                <p className="text-xl -mt-4 pb-5">All Available Assets</p>
                <div className="divide-x-8">
                    <DropdownButton items={[{text: "Filter Asset"}]} primary/>
                    <DropdownButton items={[{text: "Filter APY"}]} primary/>
                    <DropdownButton items={[{text: "Filter TVL"}]} primary/>
                </div>
                <MarketsTable data={_mockMarketsData} />
            </Card>
        </AppTemplate>
    )
}
export default Markets;

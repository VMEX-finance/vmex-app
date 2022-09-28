import { ReLineChart } from "../../components/charts";
import React from "react";
import { Card } from "../../components/cards";
import { PillDisplay } from "../../components/displays";
import { lineData, lineData2 } from "../../../utils/mock-data";
import { DropdownButton } from "../../components/buttons";

export const LendingPerformanceCard: React.FC = () => {
    return (
        <Card black className="md:max-w-[450px]">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg">Performance</h3>
                <DropdownButton primary items={[{text: "All Tranches"}]} />
            </div>
            <div className="grid gap-3 w-full px-3">
                <div className="grid w-full h-[240px]">
                    <h4>Profit / Loss (P&L)</h4>
                    <ReLineChart data={lineData} color="#3CB55E" timeseries />
                </div>
                <div className="grid w-full h-[240px]">
                    <h4>Insurance Utilization</h4>
                    <ReLineChart data={lineData2} color="#fff" timeseries />
                </div>
                <div className="grid w-full h-full">
                    <h4 className="mb-2">Assets On Loan</h4>
                    <div className="flex flex-wrap gap-3">
                        <PillDisplay asset="DAI" value={0.11} />
                        <PillDisplay asset="USDC" value={0.03} />
                        <PillDisplay asset="WBTC" value={0.92} />
                        <PillDisplay asset="CRV" value={1.48} />
                    </div>
                </div>
            </div>
        </Card>
    )
}
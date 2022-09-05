import { ReLineChart } from "../../components/charts/line-chart";
import React from "react";
import { Card } from "../../components/cards/default";
import DropdownButton from "../../components/buttons/Dropdown";
import { PillDisplay } from "../../components/displays/Pill";

const LendingPerformanceCard: React.FC = () => {
    return (
        <Card black className="md:max-w-[450px]">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg">Performance</h3>
                <DropdownButton primary items={[{text: "All Tranches"}]} />
            </div>
            <div className="grid gap-3 w-full px-3">
                <div className="grid w-full h-[240px]">
                    <h4>Profit / Loss (P&L)</h4>
                    <ReLineChart />
                </div>
                <div className="grid w-full h-[240px]">
                    <h4>Insurance Utilization</h4>
                    <ReLineChart />
                </div>
                <div className="grid w-full h-full">
                    <h4 className="mb-2">Assets On Loan</h4>
                    <div className="flex flex-wrap gap-3">
                        <PillDisplay asset="BTC" value={0.11} />
                        <PillDisplay asset="BTC" value={0.11} />
                        <PillDisplay asset="BTC" value={0.11} />
                        <PillDisplay asset="BTC" value={0.11} />
                    </div>
                </div>
            </div>
        </Card>
    )
}
export default LendingPerformanceCard;
import React from "react";
import { AppTemplate, GridView } from "../ui/templates";
import { BorrowedAssetsCard, ViewBorrowAssetsCard } from "../ui/features/borrow";

const Tranches: React.FC = () => {
    return (
        <AppTemplate title="Tranches">
            <GridView>
                <div className="lg:col-span-1">
                  <BorrowedAssetsCard />
                </div>
                <div className="lg:col-span-4">
                  <ViewBorrowAssetsCard />
                </div>
            </GridView>
        </AppTemplate>
    )
}
export default Tranches;

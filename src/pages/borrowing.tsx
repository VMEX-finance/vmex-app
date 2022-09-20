import React from "react";
import { AppTemplate, GridView } from "../ui/templates";
import { BorrowedAssetsCard, ViewBorrowAssetsCard } from "../ui/features/borrowing";

const Borrowing: React.FC = () => {
    return (
        <AppTemplate title="borrowing">
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
export default Borrowing;

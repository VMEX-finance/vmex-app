import React from "react";
import AppTemplate from "../templates/app-template";
import GridView from "../templates/grid-template";
import BorrowedAssetsCard from "../features/borrowing/BorrowedAssetsCard";
import ViewBorrowAssetsCard from "../features/borrowing/ViewAssetsCard";

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

import { Card } from '../ui/components/cards';
import React from 'react';
import { AppTemplate } from '../ui/templates';
import { TranchesTable } from '../ui/components/tables';
import { _mockTranchesData } from '../models/tranches';
//import { TokenData } from "../hooks/user-data";
//import { ITokenData } from "../store/token-data";
import { DropdownButton } from '../ui/components/buttons';

const Tranches: React.FC = () => {
    /*  const {
        isLoading,
        error,
        error_msg,
        data
    }: ITokenData = TokenData(); */

    return (
        <AppTemplate title="pools">
            <Card>
                <p className="text-xl -mt-4 pb-5">All Available Tranches</p>
                <div className="divide-x-8">
                    <DropdownButton items={[{ text: 'Filter Asset' }]} primary />
                    <DropdownButton items={[{ text: 'Filter APY' }]} primary />
                    <DropdownButton items={[{ text: 'Filter TVL' }]} primary />
                </div>
                <TranchesTable data={_mockTranchesData} />
            </Card>
        </AppTemplate>
    );
};
export default Tranches;

/* import React from 'react';
import { AppTemplate, GridView } from '../ui/templates';
import { BorrowedAssetsCard, ViewBorrowAssetsCard } from '../ui/features/borrow';

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
    );
};
export default Tranches;
 */

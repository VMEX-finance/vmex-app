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
        <AppTemplate title="tranches">
            <Card>
                <p className="text-xl -mt-4 pb-5">All Available Tranches</p>
                <div className="divide-x-8 divide-transparent">
                    <DropdownButton items={[{ text: 'Filter Asset' }]} primary direction="right" />
                    <DropdownButton items={[{ text: 'Filter APY' }]} primary direction="right" />
                    <DropdownButton items={[{ text: 'Filter TVL' }]} primary direction="right" />
                </div>
                <TranchesTable data={_mockTranchesData} />
            </Card>
        </AppTemplate>
    );
};
export default Tranches;

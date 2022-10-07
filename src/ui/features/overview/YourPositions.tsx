import React from 'react';
import { Card } from '../../components/cards';
import { YourBorrowsTable, YourSuppliesTable } from '../../components/tables';
import { _mockAssetData } from '../../../models/available-liquidity-model';

interface IYourPositionsProps {
    type: 'borrows' | 'supplies';
}

export const YourPositions: React.FC<IYourPositionsProps> = ({ type }) => {
    const determineTitle = () => {
        switch (type) {
            case 'supplies':
                return 'Supplies';
            case 'borrows':
                return 'Borrows';
        }
    };

    const determineTable = () => {
        switch (type) {
            case 'supplies':
                return <YourSuppliesTable data={_mockAssetData.data} />;
            case 'borrows':
                return <YourBorrowsTable data={_mockAssetData.data} />;
        }
    };

    return (
        <Card>
            <h3 className="text-lg mb-8">Your {determineTitle()}</h3>
            <div>{determineTable()}</div>
        </Card>
    );
};

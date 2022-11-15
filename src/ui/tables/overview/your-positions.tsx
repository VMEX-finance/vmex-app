import React from 'react';
import { Card } from '../../components/cards';
import {
    YourBorrowsTable,
    YourSuppliesTable,
    IYourBorrowsTableItemProps,
    IYourSuppliesTableItemProps,
} from '..';

interface IYourPositionsProps {
    type: 'borrows' | 'supplies';
    data: IYourBorrowsTableItemProps[] | IYourSuppliesTableItemProps[]; // TODO: implement type
}

export const YourPositionsTable: React.FC<IYourPositionsProps> = ({ type, data }) => {
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
                return <YourSuppliesTable data={data as IYourSuppliesTableItemProps[]} />;
            case 'borrows':
                return <YourBorrowsTable data={data as IYourBorrowsTableItemProps[]} />;
        }
    };

    return (
        <Card>
            <h3 className="text-lg mb-8">Your {determineTitle()}</h3>
            <div>{determineTable()}</div>
        </Card>
    );
};

import React from 'react';
import { Card } from '../../components/cards';
import {
    YourBorrowsTable,
    YourSuppliesTable,
    IYourBorrowsTableItemProps,
    IYourSuppliesTableItemProps,
} from '.';
import { Button } from '../../components/buttons';
import { useNavigate } from 'react-router-dom';

interface IYourPositionsProps {
    type: 'borrows' | 'supplies';
    data?: IYourBorrowsTableItemProps[] | IYourSuppliesTableItemProps[];
    isLoading?: boolean;
    withHealth?: boolean;
}

export const YourPositionsTable: React.FC<IYourPositionsProps> = ({
    type,
    data,
    isLoading,
    withHealth,
}) => {
    const navigate = useNavigate();
    const determineTitle = () => {
        switch (type) {
            case 'supplies':
                return 'Supplies';
            case 'borrows':
                return 'Borrows';
        }
    };

    const determineNoDataMsg = () => {
        switch (type) {
            case 'supplies':
                return 'Supplied';
            case 'borrows':
                return 'Borrowed';
        }
    };

    const determineTable = () => {
        switch (type) {
            case 'supplies':
                return (
                    <YourSuppliesTable
                        withHealth={withHealth}
                        data={(data as IYourSuppliesTableItemProps[]) || []}
                    />
                );
            case 'borrows':
                return (
                    <YourBorrowsTable
                        withHealth={withHealth}
                        data={(data as IYourBorrowsTableItemProps[]) || []}
                    />
                );
        }
    };

    return (
        <Card loading={isLoading} title={`Your ${determineTitle()}`} titleClass="text-lg mb-8">
            {data && data.length !== 0 ? (
                <div>{determineTable()}</div>
            ) : (
                <div className="w-full flex-col my-10 lg:my-20 text-center">
                    <div className="mb-5">
                        <span>No Assets {determineNoDataMsg()}</span>
                    </div>
                    <Button
                        primary
                        label="See Available Markets"
                        onClick={() => navigate('/markets')}
                    />
                </div>
            )}
        </Card>
    );
};

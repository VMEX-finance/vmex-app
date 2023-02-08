import React from 'react';
import { Card, Button, DefaultAccordion, HealthFactor } from '../../components';
import {
    YourBorrowsTable,
    YourSuppliesTable,
    IYourBorrowsTableItemProps,
    IYourSuppliesTableItemProps,
} from '.';
import { useNavigate } from 'react-router-dom';

interface IYourPositionsProps {
    type: 'borrows' | 'supplies';
    data?: IYourBorrowsTableItemProps[] | IYourSuppliesTableItemProps[];
    isLoading?: boolean;
}

export const YourPositionsTable: React.FC<IYourPositionsProps> = ({ type, data, isLoading }) => {
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

    const formattedExpandables:
        | IYourSuppliesTableItemProps[]
        | IYourBorrowsTableItemProps[]
        | any[] = data
        ? (data as any).reduce((acc: any, each: any) => {
              let index = acc.length - 1;
              if (acc.length && acc[index][0].trancheId == each.trancheId) {
                  acc[index].push(each);
              } else {
                  acc.push([each]);
              }
              return acc;
          }, [])
        : [];

    const determineTable = () => {
        switch (type) {
            case 'supplies':
                return formattedExpandables.map((el, i) => (
                    <DefaultAccordion
                        key={`accordion-supplies-${i}`}
                        title={`accordion-supplies-${i}`}
                        summary={
                            <div className="grid items-center grid-cols-3 w-full">
                                <span>{el[0].trancheId}</span>
                                <span className="">{el[0].tranche}</span>
                                <span className="justify-self-end">
                                    <HealthFactor
                                        withChange={false}
                                        trancheId={el[0].trancheId.toString()}
                                        showInfo={false}
                                    />
                                </span>
                            </div>
                        }
                        details={
                            <YourSuppliesTable data={(el as IYourSuppliesTableItemProps[]) || []} />
                        }
                    />
                ));
            case 'borrows':
                return formattedExpandables.map((el, i) => (
                    <DefaultAccordion
                        key={`accordion-supplies-${i}`}
                        title={`accordion-supplies-${i}`}
                        summary={
                            <div className="grid items-center grid-cols-3 w-full">
                                <span>{el[0].trancheId}</span>
                                <span className="">{el[0].tranche}</span>
                                <span className="justify-self-end">
                                    <HealthFactor
                                        withChange={false}
                                        trancheId={el[0].trancheId.toString()}
                                        showInfo={false}
                                    />
                                </span>
                            </div>
                        }
                        details={
                            <YourBorrowsTable data={(el as IYourSuppliesTableItemProps[]) || []} />
                        }
                    />
                ));
        }
    };

    return (
        <Card loading={isLoading} title={`Your ${determineTitle()}`} titleClass="text-lg mb-8">
            {data && data.length !== 0 ? (
                <div>
                    <div className="grid items-center grid-cols-3 w-full text-sm font-semibold pr-4 pl-10">
                        <span className="">ID</span>
                        <span className="">Tranche</span>
                        <span className="justify-self-end">Health</span>
                    </div>
                    {determineTable()}
                </div>
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

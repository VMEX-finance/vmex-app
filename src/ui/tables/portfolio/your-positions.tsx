import React, { useContext } from 'react';
import {
    Card,
    Button,
    DefaultAccordion,
    HealthFactor,
    MultipleAssetsDisplay,
} from '@/ui/components';
import {
    YourBorrowsTable,
    YourSuppliesTable,
    IYourBorrowsTableItemProps,
    IYourSuppliesTableItemProps,
} from '.';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '@/store';

interface IYourPositionsProps {
    type: 'borrows' | 'supplies';
    data?: IYourBorrowsTableItemProps[] | IYourSuppliesTableItemProps[];
    isLoading?: boolean;
}

export const YourPositionsTable: React.FC<IYourPositionsProps> = ({ type, data, isLoading }) => {
    const { isDark } = useContext(ThemeContext);
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
        ? (data as any[]).reduce((acc: any, each: any) => {
              let index = acc.length - 1;
              if (acc.length && acc[index][0].trancheId == each.trancheId) {
                  acc[index].push(each);
              } else {
                  acc.push([each]);
              }
              return acc;
          }, [])
        : [];

    const assetsPreview = formattedExpandables.map(
        (el: any) => el.length > 0 && el.map(({ asset }: any) => asset),
    );

    const determineTable = () => {
        switch (type) {
            case 'supplies':
                return formattedExpandables.map((el, i) => (
                    <DefaultAccordion
                        key={`accordion-supplies-${i}`}
                        title={`accordion-supplies-${i}`}
                        summary={
                            <div className="grid items-center grid-cols-4 w-full">
                                <span>{el[0].trancheId}</span>
                                <span className="truncate">{el[0].tranche}</span>
                                <span className="justify-self-end">
                                    <MultipleAssetsDisplay
                                        assets={assetsPreview[i]}
                                        size="sm"
                                        show={4}
                                        gap="gap-1"
                                    />
                                </span>
                                <span className="justify-self-end">
                                    <HealthFactor
                                        withChange={false}
                                        trancheId={el[0].trancheId.toString()}
                                        showInfo={false}
                                        size="sm"
                                    />
                                </span>
                            </div>
                        }
                        details={
                            <div className="px-2 xl:px-4">
                                <YourSuppliesTable
                                    data={(el as IYourSuppliesTableItemProps[]) || []}
                                    responsive
                                />
                            </div>
                        }
                    />
                ));
            case 'borrows':
                return formattedExpandables.map((el, i) => (
                    <DefaultAccordion
                        key={`accordion-supplies-${i}`}
                        title={`accordion-supplies-${i}`}
                        summary={
                            <div className="grid items-center grid-cols-4 w-full">
                                <span>{el[0].trancheId}</span>
                                <span className="truncate">{el[0].tranche}</span>
                                <span className="justify-self-end">
                                    <MultipleAssetsDisplay
                                        assets={assetsPreview[i]}
                                        size="sm"
                                        show="all"
                                        gap="gap-1"
                                    />
                                </span>
                                <span className="justify-self-end">
                                    <HealthFactor
                                        withChange={false}
                                        trancheId={el[0].trancheId.toString()}
                                        showInfo={false}
                                        size="sm"
                                    />
                                </span>
                            </div>
                        }
                        details={
                            <div className="px-2 xl:px-4">
                                <YourBorrowsTable
                                    data={(el as IYourSuppliesTableItemProps[]) || []}
                                    responsive
                                />
                            </div>
                        }
                    />
                ));
        }
    };

    return (
        <Card loading={isLoading} title={`Your ${determineTitle()}`} titleClass="text-lg mb-2">
            {data && data.length !== 0 ? (
                <div>
                    <ul
                        className={`grid items-center grid-cols-4 w-full text-sm font-semibold pl-6 pr-3 py-1 border-b ${
                            isDark ? 'border-neutral-800' : 'border-neutral-300'
                        }`}
                    >
                        <li className="">ID</li>
                        <li className="">Tranche</li>
                        <li className="justify-self-end">Assets</li>
                        <li className="justify-self-end">Health</li>
                    </ul>
                    {determineTable()}
                </div>
            ) : (
                <div className="w-full flex-col my-10 lg:my-20 text-center">
                    <div className="mb-5">
                        <span>No Assets {determineNoDataMsg()}</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <Button type="accent" onClick={() => navigate('/markets')}>
                            See Available Markets
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

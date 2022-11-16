import { UseQueryResult } from '@tanstack/react-query';
import { IUserPerformanceCardProps } from '@ui/features';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '@ui/tables';

export type IUserDataProps = {
    queryUserPerformance: UseQueryResult<IUserPerformanceCardProps, unknown>;
    queryUserActivity: UseQueryResult<IUserActivityDataProps, unknown>;
};

export type IUserActivityDataProps = {
    supplies: IYourSuppliesTableItemProps[];
    borrows: IYourBorrowsTableItemProps[];
};

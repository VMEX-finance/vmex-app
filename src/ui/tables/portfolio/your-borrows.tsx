import React from 'react';
import { AssetDisplay, NumberAndDollar, renderHealth } from '../../components/displays';
import { BigNumber } from 'ethers';
import { bigNumberToNative, determineHealthColor } from '../../../utils';
import { useWindowSize, useDialogController } from '../../../hooks';

import MUIDataTable, { FilterType, Responsive, SelectableRows } from 'mui-datatables';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
export type IYourBorrowsTableItemProps = {
    asset: string;
    amount: string;
    amountNative: BigNumber;
    apy: number;
    tranche: string;
    trancheId: number;
    healthFactor?: number;
};

export type IYourBorrowsTableProps = {
    data: IYourBorrowsTableItemProps[];
    withHealth?: boolean;
    healthLoading?: boolean;
};

export const YourBorrowsTable: React.FC<IYourBorrowsTableProps> = ({
    data,
    withHealth,
    healthLoading,
}) => {
    const { width } = useWindowSize();
    const { openDialog } = useDialogController();
    const columns = [
        {
            name: 'Tranche Id',
        },
        {
            name: 'Tranche Name',
        },
        {
            name: 'Health',
            options: {
                filter: true,
                customBodyRender: (value: number, tableMeta: any, updateValue: any) => {
                    return renderHealth(value, 'sm', healthLoading || true);
                },
            },
        },
    ];

    const options = {
        filter: true,
        onFilterChange: (changedColumn: any, filterList: any) => {
            console.log(changedColumn, filterList);
        },
        selectableRows: 'single' as SelectableRows,
        filterType: 'dropdown' as FilterType,
        responsive: 'standard' as Responsive,
        rowsPerPage: 10,
        expandableRows: true,
        renderExpandableRow: (rowData: any, rowMeta: any) => {
            console.log('Tranche id: ', rowData[0]);
            return (
                <React.Fragment>
                    <tr>
                        <td colSpan={6}>
                            <TableContainer component={Paper}>
                                <Table style={{ minWidth: '650' }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right">Asset</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                            <TableCell align="right">APY%</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data
                                            .filter((el) => el.trancheId == rowData[0])
                                            .map((i, index) => {
                                                return (
                                                    <TableRow
                                                        key={`${i.trancheId}-${i.asset}`}
                                                        className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            openDialog('borrow-asset-dialog', {
                                                                ...i,
                                                                view: 'Repay',
                                                            });
                                                        }}
                                                    >
                                                        <TableCell align="right">
                                                            <AssetDisplay
                                                                name={width > 600 ? i.asset : ''}
                                                                logo={`/coins/${i.asset?.toLowerCase()}.svg`}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <NumberAndDollar
                                                                value={`${bigNumberToNative(
                                                                    i.amountNative,
                                                                    i.asset,
                                                                )} ${width > 600 ? i.asset : ''}`}
                                                                dollar={i.amount}
                                                                size="xs"
                                                                color="text-brand-black"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {i.apy}%
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </td>
                    </tr>
                </React.Fragment>
            );
        },
        page: 1,
    };

    return (
        <MUIDataTable
            title={'Your Borrowed Tranches'}
            data={data
                .filter(
                    (elem, index) =>
                        data.findIndex((obj) => obj.trancheId === elem.trancheId) === index,
                )
                .map((el) => [el.trancheId, el.tranche, el.healthFactor])}
            columns={columns}
            options={options}
        />
    );
};

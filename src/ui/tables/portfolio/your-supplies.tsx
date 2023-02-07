import React, { useState, useEffect } from 'react';
import {
    AssetDisplay,
    BasicToggle,
    NumberAndDollar,
    HealthFactor,
    renderHealth,
} from '../../components';
import { BigNumber } from 'ethers';
import { useWindowSize, useDialogController } from '../../../hooks';
import { bigNumberToNative, determineHealthColor } from '../../../utils';

import MUIDataTable, { FilterType, Responsive, SelectableRows } from 'mui-datatables';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export type IYourSuppliesTableItemProps = {
    asset: string;
    amount: string;
    amountNative: BigNumber;
    collateral: boolean;
    apy: number;
    tranche: string;
    trancheId: number;
    healthFactor?: number;
};

export type IYourSuppliesTableProps = {
    data: IYourSuppliesTableItemProps[];
    withHealth?: boolean;
    healthLoading?: boolean;
};

export const YourSuppliesTable: React.FC<IYourSuppliesTableProps> = ({
    data,
    withHealth,
    healthLoading,
}) => {
    const { width } = useWindowSize();
    const [checked, setChecked] = useState<boolean[]>([]);
    const { openDialog } = useDialogController();

    useEffect(() => {
        if (data.length > 0) {
            const initialState = data.map((el) => el.collateral);
            setChecked(initialState);
        }
    }, [data]);

    //['Asset', 'Amount', 'Collateral', 'APY%', 'Tranche', 'Health'
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
                                            <TableCell align="right">Collateral</TableCell>
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
                                                            openDialog('loan-asset-dialog', {
                                                                ...i,
                                                                view: 'Withdraw',
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
                                                            <BasicToggle
                                                                checked={checked[index]}
                                                                onClick={(e: any) => {
                                                                    e.preventDefault();
                                                                    openDialog(
                                                                        'toggle-collateral-dialog',
                                                                        {
                                                                            ...i,
                                                                            checked,
                                                                            setChecked,
                                                                            index,
                                                                            trancheId: i.trancheId,
                                                                        },
                                                                    );
                                                                    e.stopPropagation();
                                                                }}
                                                                size="small"
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
            title={'Your Supplied Tranches'}
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

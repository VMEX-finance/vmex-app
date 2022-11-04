import MUIDataTable from 'mui-datatables';
import React, { Fragment } from 'react';

interface ITableTemplate extends React.PropsWithChildren {
    columns: Array<any>;
    data: Array<any>;
    title: Array<any>;
    options?: any;
    components?: any;
}

export const TableTemplate: React.FC<ITableTemplate> = ({ columns, data, title, options }) => {
    return (
        <>
            <MUIDataTable columns={columns} data={data} title={title} options={options} />
        </>
    );
};

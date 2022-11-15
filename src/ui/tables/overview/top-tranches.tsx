import { usdFormatter } from '../../../utils/helpers';
import React from 'react';

// TODO: add this to shared models
export interface ITopTranchesItemProps {
    name: string;
    borrowed: number;
    supplied: number;
}

interface ITableProps {
    data: ITopTranchesItemProps[];
}

export const TopTranchesTable: React.FC<ITableProps> = ({ data }) => {
    const headers = ['Tranche', 'Supplied', 'Borrowed'];

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`py-3 text-left text-sm font-semibold text-gray-900`}
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.slice(0, 5).map((i) => {
                        return (
                            <tr key={i.name} className="text-left">
                                <td>{i.name}</td>
                                <td>{usdFormatter.format(i.supplied)}</td>
                                <td>{usdFormatter.format(i.borrowed)}</td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

import { bigNumberToUSD } from '../../../utils/sdk-helpers';
import { TrancheData } from '@vmex/sdk';
import React from 'react';
import { makeCompact } from '../../../utils/helpers';

interface ITableProps {
    data: TrancheData[];
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
                    data.slice(0, 5).map((i, index: number) => {
                        return (
                            <tr key={`${i.name}-${index}`} className="text-left">
                                <td>{i.name}</td>
                                <td>{makeCompact(bigNumberToUSD(i.totalSupplied, 18))}</td>
                                <td>{makeCompact(bigNumberToUSD(i.totalBorrowed, 18))}</td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

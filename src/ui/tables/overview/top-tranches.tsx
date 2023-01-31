import React from 'react';
import { makeCompact } from '../../../utils/helpers';
import { TrancheData } from '../../../api/types';
import { SkeletonLoader } from '../../components';

interface ITableProps {
    data: TrancheData[];
    loading?: boolean;
}

export const TopTranchesTable: React.FC<ITableProps> = ({ data, loading }) => {
    const headers = ['Tranche', 'Supplied', 'Borrowed'];

    return (
        <table className="min-w-full divide-y-2 divide-neutral-300 dark:divide-neutral-800 font-basefont mt-1">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`pb-1 text-left text-sm font-semibold`}
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-neutral-300 dark:divide-neutral-800">
                {data && !loading
                    ? data.slice(0, 5).map((i, index: number) => {
                          return (
                              <tr key={`${i.name}-${index}`} className="text-left">
                                  <td>{i.name}</td>
                                  <td>{makeCompact(i.totalSupplied)}</td>
                                  <td>{makeCompact(i.totalBorrowed)}</td>
                              </tr>
                          );
                      })
                    : [1, 2, 3].map((el) => (
                          <tr key={`table-skeleton-row-${el}`} className="text-left">
                              {[1, 2, 3].map((subEl) => (
                                  <td key={`table-skeleton-cell-${el}-${subEl}`}>
                                      <SkeletonLoader variant="rectangular" />
                                  </td>
                              ))}
                          </tr>
                      ))}
            </tbody>
        </table>
    );
};

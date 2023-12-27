import React from 'react';
import { makeCompact, truncate } from '@/utils';
import { TrancheData } from '@/api';
import { Loader } from '@/ui/components';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';

interface ITableProps {
    data: TrancheData[];
    loading?: boolean;
}

export const TopTranchesTable: React.FC<ITableProps> = ({ data, loading }) => {
    const navigate = useNavigate();
    const { updateTranche } = useSelectedTrancheContext();

    const route = (e: Event, tranche: any, view: 'overview' | 'details' = 'overview') => {
        e.stopPropagation();
        updateTranche('id', tranche.id);
        navigate(`/tranches/${tranche.name?.toLowerCase().replace(/\s+/g, '-')}`, {
            state: { view, trancheId: tranche.id },
        });
        window.scrollTo(0, 0);
    };

    const headers = ['Tranche', 'Supply', 'Borrow'];
    return (
        <table className="min-w-full divide-y-2 divide-neutral-300 dark:divide-neutral-800 font-basefont mt-1">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`pb-1 first-of-type:pl-1 text-left text-sm font-semibold`}
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
                              <tr
                                  key={`${i.name}-${index}`}
                                  className="text-left cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition duration-150"
                                  onClick={(e) => route(e as any, i)}
                              >
                                  <td className="py-1 pl-1">{truncate(i.name)}</td>
                                  <td>{makeCompact(i.totalSupplied)}</td>
                                  <td>{makeCompact(i.totalBorrowed)}</td>
                              </tr>
                          );
                      })
                    : [1, 2, 3].map((el) => (
                          <tr key={`table-skeleton-row-${el}`} className="text-left">
                              {[1, 2, 3].map((subEl) => (
                                  <td key={`table-skeleton-cell-${el}-${subEl}`}>
                                      <Loader type="skeleton" variant="rectangular" />
                                  </td>
                              ))}
                          </tr>
                      ))}
            </tbody>
        </table>
    );
};

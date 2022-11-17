import React from 'react';
import { useDialogController } from '../../../hooks/dialogs';
import { AssetDisplay } from '../../components/displays';
import { numberFormatter, percentFormatter } from '../../../utils/helpers';

export type IYourBorrowsTableItemProps = {
    asset: string;
    amount: number;
    apy: number;
    tranche: string;
    trancheId: number;
};

export type IYourBorrowsTableProps = {
    data: IYourBorrowsTableItemProps[];
};

export const YourBorrowsTable: React.FC<IYourBorrowsTableProps> = ({ data }) => {
    const { openDialog } = useDialogController();
    const headers = ['Asset', 'Amount', 'APY%', 'Tranche'];

    return (
        <table className="min-w-full divide-y divide-gray-300 font-basefont">
            <thead className="">
                <tr>
                    {headers.map((el, i) => (
                        <th
                            key={`table-header-${i}`}
                            scope="col"
                            className={`py-3 text-left text-sm font-semibold text-gray-900 first-of-type:pl-2 first-of-type:md:pl-6`}
                        >
                            {el}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {data &&
                    data.map((i) => {
                        return (
                            <tr
                                key={i.asset}
                                className="text-left transition duration-200 hover:bg-neutral-200 hover:cursor-pointer"
                                onClick={() =>
                                    openDialog('borrowed-asset-details-dialog', { ...i })
                                }
                            >
                                <td className="whitespace-nowrap p-4 text-sm sm:pl-6">
                                    <AssetDisplay name={i.asset} />
                                </td>
                                <td className="">{`${numberFormatter.format(i.amount)} ${
                                    i.asset
                                }`}</td>
                                <td>{percentFormatter.format(i.apy)}</td>
                                <td className="">{i.tranche}</td>
                                {/* <td className="text-right hidden md:table-cell pr-3.5">
                                    <Button
                                        label={
                                            (width > 1535 && width < 2000) || width < 500
                                                ? 'View'
                                                : 'View Details'
                                        }
                                        // TODO: Send from here to appropriate traunch details view
                                        onClick={() => console.log('directing')}
                                    />
                                </td> */}
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

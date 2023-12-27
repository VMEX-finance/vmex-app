import React from 'react';
import { useUserHistory } from '@/api';
import { useTransactionsContext } from '@/store';
import {
    NETWORKS,
    dateToLocale,
    getNetworkName,
    renderIcon,
    renderTxStatus,
    truncate,
} from '@/utils';
import { useAccount } from 'wagmi';
import { AssetDisplay, SmartPrice, Tooltip } from '@/ui/components';
import { useWindowSize } from '@/hooks';

export const YourTransactionsTable = () => {
    const { width, breakpoints } = useWindowSize();
    const { address } = useAccount();
    const { transactions } = useTransactionsContext();
    const { queryUserTxHistory } = useUserHistory(address);

    const network = getNetworkName();

    const renderStatus = (status: 'error' | 'pending' | 'complete') => {
        switch (status) {
            case 'complete': {
                if (width < breakpoints.xl) return renderTxStatus('complete');
                return <span className="text-green-500 dark:text-green-400">Success</span>;
            }
            case 'pending': {
                if (width < breakpoints.xl) return renderTxStatus('pending');
                return <span className="text-yellow-400">Pending</span>;
            }
            default: {
                if (width < breakpoints.xl) return renderTxStatus('error');
                return <span className="text-red-600">Error</span>;
            }
        }
    };

    const renderType = (type: 'Deposit' | 'Borrow' | 'Loop' | 'Stake') => {
        // TODO: Loop and Stake
        switch (type) {
            case 'Deposit':
                return renderIcon('lend');
            case 'Borrow':
                return renderIcon('borrow');
            default:
                return renderIcon();
        }
    };

    const headers = ['Hash', 'Date', 'Type', 'Amount', 'Status'];
    return (
        <div className="fix-table-head">
            {queryUserTxHistory?.data?.length || transactions?.length ? (
                <table className="min-w-full divide-y-2 divide-gray-300 dark:divide-neutral-800 font-basefont">
                    <thead className="">
                        <tr>
                            {headers.map((el, i) => (
                                <th
                                    key={`table-header-${i}`}
                                    scope="col"
                                    className={`bg-white pr-3 dark:bg-brand-black py-1 text-left text-sm font-semibold text-neutral900 first-of-type:pl-2 first-of-type:md:pl-6 ${
                                        i === headers.length - 1
                                            ? 'hidden sm:table-cell text-right'
                                            : ''
                                    } ${i === headers.length - 2 ? 'text-right' : ''}`}
                                >
                                    {el}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                        {transactions?.map((el, i) => (
                            <tr
                                className="text-left transition duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                key={`transaction-${i}`}
                            >
                                <td className="whitespace-nowrap pl-4 py-2 sm:pl-6">
                                    <a
                                        href={`${NETWORKS[network].explorer}/tx/${el.text}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {truncate(el.text, 3)}
                                    </a>
                                </td>
                                <td>{el.date}</td>
                                <td>
                                    {width > breakpoints['2xl']
                                        ? el?.type || ''
                                        : renderType(el.type as any)}
                                </td>
                                <td>
                                    <span className="flex gap-1 items-center justify-end pr-3 sm:pr-0">
                                        <SmartPrice price={el.amount} />{' '}
                                        <AssetDisplay name={el.asset} size={'sm'} noText />
                                    </span>
                                </td>
                                <td className="hidden sm:table-cell text-right pr-3">
                                    <span className="flex justify-end items-center">
                                        {renderStatus(el.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {queryUserTxHistory?.data?.map((el, i) => (
                            <tr
                                className="text-left transition duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                key={`transaction-${i}`}
                            >
                                <td className="whitespace-nowrap pl-4 py-2 sm:pl-6">
                                    <a
                                        href={`${NETWORKS[network].explorer}/tx/${el.txHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {truncate(el.txHash, 3)}
                                    </a>
                                </td>
                                <td>
                                    <span>{dateToLocale(el.datetime)}</span>
                                </td>
                                <td>
                                    {width > breakpoints['2xl']
                                        ? el?.type || ''
                                        : renderType(el.type as any)}
                                </td>
                                <td>
                                    <span className="flex gap-1 items-center justify-end pr-3 sm:pr-0">
                                        <SmartPrice price={el.amount} />{' '}
                                        <AssetDisplay name={el.asset} size={'sm'} noText />
                                    </span>
                                </td>
                                <td className="hidden sm:table-cell text-right pr-3">
                                    <span className="flex justify-end items-center">
                                        {renderStatus('complete')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex justify-center items-center pt-12 pb-4">
                    <span className="text-neutral-700 dark:text-neutral-400">
                        No Transaction History Available
                    </span>
                </div>
            )}
        </div>
    );
};

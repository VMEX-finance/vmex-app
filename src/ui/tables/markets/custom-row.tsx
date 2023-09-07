import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { AssetDisplay, SplitButton, Tooltip } from '@/ui/components';
import { useDialogController, useWindowSize } from '@/hooks';
import { useApyData, IMarketsAsset } from '@/api';
import { findInObjArr, percentFormatter, usdFormatter } from '@/utils';

const MarketsCustomRow = (props: any) => {
    const {
        asset,
        tranche,
        trancheId,
        supplyApy,
        borrowApy,
        yourAmount,
        available,
        borrowTotal,
        supplyTotal,
        // rating,
        strategies,
        collateral,
        borrowable,
    } = props;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { openDialog } = useDialogController();
    const { queryAssetApys } = useApyData();

    const route = (e: Event, market: IMarketsAsset, view = 'overview') => {
        e.stopPropagation();
        setAsset(market.asset);
        updateTranche('id', market.trancheId.toString());
        navigate(`/tranches/${market.tranche.replace(/\s+/g, '-')}`, {
            state: { view, trancheId: market.trancheId.toString() },
        });
    };

    const handleActionClick = (e: any) => {
        e.stopPropagation();
        if (e.target.innerHTML === 'Supply') {
            openDialog('loan-asset-dialog', {
                asset: asset,
                trancheId: trancheId,
                collateral,
            });
        } else {
            openDialog('borrow-asset-dialog', {
                asset: asset,
                trancheId: trancheId,
                collateral,
            });
        }
    };

    const renderApy = () => {
        const rewardApy = findInObjArr('symbol', asset, queryAssetApys.data);
        if (rewardApy) {
            const { apysByToken, asset, assetType, name, symbol, totalApy } = rewardApy;
            const percent = percentFormatter.format(Number(totalApy) / 100);
            if (apysByToken?.length) {
                return (
                    <Tooltip id={asset} content={percent}>
                        <div className="min-w-[120px]">
                            <span className="font-bold">APY Breakdown</span>
                            {apysByToken.map((x: any) => (
                                <div
                                    className="text-sm flex justify-between items-center gap-6"
                                    key={`reward-apy-tooltip-${x.asset}`}
                                >
                                    <span>{x?.symbol || x.asset}</span>
                                    <span>{percentFormatter.format(Number(x.apy) / 100)}</span>
                                </div>
                            ))}
                        </div>
                    </Tooltip>
                );
            }
            return percent;
        }
        return supplyApy;
    };

    // Mobile
    if (width < 900) {
        return (
            <tr
                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer flex flex-col px-4 pt-2 pb-1 border-y-[1px] dark:border-neutral-800"
                onClick={(e: any) => route(e, props)}
            >
                <td className="flex justify-between">
                    <span className="font-bold">Asset</span>
                    <div className="flex items-center gap-2">
                        <AssetDisplay name={asset} />
                    </div>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Tranche</span>
                    <span>{tranche}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Supply APY</span>
                    <span>{renderApy()}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Borrow APY</span>
                    <span>{borrowable ? borrowApy : '-'}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Your Amount</span>
                    <span className={`${yourAmount.loading ? 'animate-pulse' : ''}`}>
                        {yourAmount.amount}
                    </span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Available Borrows</span>
                    <span>{borrowable ? usdFormatter().format(available) : '-'}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Supply</span>
                    <span>{usdFormatter().format(supplyTotal)}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Borrow</span>
                    <span>{borrowable ? usdFormatter().format(borrowTotal) : '-'}</span>
                </td>
                {/* <td className="flex justify-between">
                    <span className="font-bold">Rating</span>
                    <span style={{ color: determineRatingColor(rating) }}>{rating}</span>
                </td> */}
                <td className="flex justify-between">
                    <span className="font-bold">Strategy</span>
                    {strategies ? (
                        <BsCheck className="w-6 h-6 text-green-500" />
                    ) : (
                        <IoIosClose className="w-6 h-6 text-red-500" />
                    )}
                </td>
                <td>
                    <SplitButton
                        full
                        className="mt-1 mb-2"
                        content={{
                            left: 'Supply',
                            right: 'Borrow',
                        }}
                        onClick={{
                            left: handleActionClick,
                            right: handleActionClick,
                        }}
                        disabled={{ right: !borrowable }}
                    />
                </td>
            </tr>
        );
        // Desktop
    } else {
        return (
            <tr
                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer border-y-[1px] dark:border-neutral-800"
                onClick={(e: any) => route(e, props, 'details')}
            >
                <td className="whitespace-nowrap pl-2 md:pl-4 pr-2 text-sm">
                    <AssetDisplay name={asset} />
                </td>
                <td className="min-w-[150px] pl-4 py-4">{tranche}</td>
                <td className="pl-4">{renderApy()}</td>
                <td className="pl-4">{borrowable ? borrowApy : '-'}</td>
                <td className={`pl-4 ${yourAmount.loading ? 'animate-pulse' : ''}`}>
                    {yourAmount.amount}
                </td>
                <td className="pl-4">{borrowable ? usdFormatter().format(available) : '-'}</td>
                <td className="pl-4">{usdFormatter().format(supplyTotal)}</td>
                <td className="pl-4">{borrowable ? usdFormatter().format(borrowTotal) : '-'}</td>
                {/* <td className="text-lg pl-4" style={{ color: determineRatingColor(rating) }}>
                    {rating}
                </td> */}
                <td className="pl-4">
                    <div className="w-8 h-8">
                        {strategies ? (
                            <BsCheck className="w-full h-full text-[#00DD3E]" />
                        ) : (
                            <IoIosClose className="w-full h-full text-[#FF1F00]" />
                        )}
                    </div>
                </td>
                <td className="text-right pr-3.5">
                    <SplitButton
                        content={{
                            left: 'Supply',
                            right: 'Borrow',
                        }}
                        onClick={{
                            left: handleActionClick,
                            right: handleActionClick,
                        }}
                        disabled={{ right: !borrowable }}
                    />
                </td>
            </tr>
        );
    }
};

export { MarketsCustomRow };

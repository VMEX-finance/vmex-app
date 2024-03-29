import {
    Card,
    AssetDisplay,
    HealthFactor,
    MultipleAssetsDisplay,
    NumberDisplay,
    PillDisplay,
} from '@/ui/components';
import React from 'react';
import { useWindowSize, useDialogController } from '@/hooks';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '@/ui/tables';
import { makeCompact, usdFormatter } from '@/utils';

export interface ITrancheOverviewProps {
    assets?: string[];
    tvl?: number;
    tvlChange?: number;
    supplied?: number;
    supplyChange?: number;
    borrowed?: number;
    borrowChange?: number;
    grade?: string;
    loading?: boolean;
    userData?: any;
    avgApy?: number;
    collateral?: number;
    collateralChange?: number;
}

const TrancheTVLDataCard: React.FC<ITrancheOverviewProps> = ({
    assets,
    tvl,
    tvlChange,
    supplied,
    supplyChange,
    borrowChange,
    borrowed,
    grade,
    loading,
    userData,
    avgApy,
    collateral,
    collateralChange,
}) => {
    const { width, breakpoints, isBigger } = useWindowSize();
    const { openDialog } = useDialogController();
    const { data } = userData;

    const calculateUserNetAPY = () => {
        if (!data) return `0%`;
        const supplyTotal = data?.supplies.reduce(
            (partial: any, next: any) =>
                partial + parseFloat(next.amount.slice(1).replaceAll(',', '')),
            0,
        );
        const supplySum = data?.supplies.reduce(
            (partial: any, next: any) =>
                partial + next.apy * parseFloat(next.amount.slice(1).replaceAll(',', '')),
            0,
        );
        const borrowSum = data?.borrows.reduce(
            (partial: any, next: any) =>
                partial + next.apy * parseFloat(next.amount.slice(1).replaceAll(',', '')),
            0,
        );
        return `${((supplySum - borrowSum) / supplyTotal).toFixed(3)}%`;
    };

    const renderUserInteractions = (
        type: 'supplies' | 'borrows',
    ): IYourBorrowsTableItemProps[] | IYourSuppliesTableItemProps[] => {
        if (data && data[type].length > 0) return data[type];
        else return [];
    };

    const customBreakpoint = 900;

    return (
        <>
            <Card>
                <div
                    className="flex flex-col flow md:flex-row justify-between font-basefont gap-3 xl:gap-6"
                    style={{ flexFlow: 'wrap' }}
                >
                    <div className="flex flex-col justify-between order-1 min-w-[162px]">
                        <div className="flex flex-col gap-1">
                            <h2>Assets</h2>
                            <MultipleAssetsDisplay assets={assets} />
                        </div>
                    </div>
                    <div
                        className={`flex flex-wrap items-center gap-4 lg:gap-8 xl:gap-12 2xl:gap-20 ${
                            width > customBreakpoint
                                ? 'order-2 justify-between w-auto'
                                : 'order-3 justify-around w-full'
                        } sm:px-4`}
                    >
                        {/* <NumberDisplay
                            center
                            size="xl"
                            label="Avg. APY"
                            value={`${(avgApy ? avgApy : 0).toFixed(2)}%`}
                            change={tvlChange}
                            loading={loading}
                        /> */}
                        {/* WEN: uncomment when collateral is fixed, or just keep it removed */}
                        {/* <NumberDisplay
                            center
                            size="xl"
                            label="Collateral"
                            value={`${makeCompact(collateral, true)}`}
                            change={collateralChange}
                            loading={loading}
                        /> */}
                        <NumberDisplay
                            align="center"
                            size="xl"
                            label="Supplied"
                            value={`${makeCompact(supplied, true)}`}
                            change={supplyChange}
                            loading={loading}
                        />
                        <NumberDisplay
                            align="center"
                            size="xl"
                            label="Available"
                            value={`${makeCompact(tvl, true)}`}
                            change={tvlChange}
                            loading={loading}
                        />
                        <NumberDisplay
                            align="center"
                            size="xl"
                            label="Borrowed"
                            value={`${makeCompact(borrowed, true)}`}
                            change={borrowChange}
                            loading={loading}
                        />
                    </div>
                    <div
                        className={`${
                            width > customBreakpoint ? 'order-3' : 'order-2'
                        } sm:min-w-[162px] 2xl:min-w-[194px]`}
                    >
                        <div className="flex flex-col h-full justify-end">
                            <div className="flex flex-col items-end mb-1">
                                {/* <h2 className="text-2xl">Grade</h2>
                                {loading ? (
                                    <SkeletonLoader
                                        variant="rounded"
                                        height={'36px'}
                                        width={'60px'}
                                    />
                                ) : (
                                    <p className="text-3xl">{grade || '-'}</p>
                                )} */}
                                <NumberDisplay
                                    align="right"
                                    size="xl"
                                    label="Avg. APY"
                                    value={`${(avgApy ? avgApy : 0).toFixed(2)}%`}
                                    change={tvlChange}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {(renderUserInteractions('borrows').length !== 0 ||
                    renderUserInteractions('supplies').length !== 0) && (
                    <>
                        <div className="border-t-2 border-neutral-300 dark:border-gray-800 md:border-0 mt-3" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                            <div className="flex flex-col items-start text-left md:items-center md:text-center">
                                <span className="text-sm">
                                    {width > breakpoints.md && 'User '}Supplies
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {renderUserInteractions('supplies').length !== 0 ? (
                                        renderUserInteractions('supplies').map((el) => (
                                            <button
                                                key={`${el.asset}`}
                                                onClick={() =>
                                                    openDialog('loan-asset-dialog', {
                                                        ...el,
                                                        view: 'Withdraw',
                                                    })
                                                }
                                            >
                                                <PillDisplay
                                                    asset={el.asset}
                                                    value={usdFormatter().format(
                                                        parseFloat(
                                                            el.amount.slice(1).replaceAll(',', ''),
                                                        ),
                                                    )}
                                                    hoverable
                                                    size="sm"
                                                    type="asset"
                                                />
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-neutral-400">{`No Supplies`}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end md:items-center md:text-center">
                                <span className="text-sm">
                                    {width > breakpoints.md && 'User '}Borrows
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {renderUserInteractions('borrows').length !== 0 ? (
                                        renderUserInteractions('borrows').map((el) => (
                                            <button
                                                key={`${el.asset}`}
                                                onClick={() =>
                                                    openDialog('borrow-asset-dialog', {
                                                        ...el,
                                                        view: 'Repay',
                                                    })
                                                }
                                            >
                                                <PillDisplay
                                                    asset={el.asset}
                                                    value={usdFormatter().format(
                                                        parseFloat(
                                                            el.amount.slice(1).replaceAll(',', ''),
                                                        ),
                                                    )}
                                                    hoverable
                                                    size="sm"
                                                    type="asset"
                                                />
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-neutral-400">{`No Borrows`}</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-left text-sm flex flex-col items-start md:items-center md:text-center">
                                <span>
                                    {width > breakpoints.md && 'User '}Health
                                    {width > breakpoints.md && ' Factor'}
                                </span>
                                <HealthFactor withChange={false} center={isBigger('md')} />
                            </div>
                            <div className="text-right text-sm flex flex-col items-end md:items-center md:text-center">
                                <span>{width > breakpoints.md && 'User '}Net APY</span>
                                <NumberDisplay
                                    value={calculateUserNetAPY()}
                                    align={isBigger('md') ? 'center' : 'right'}
                                />
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </>
    );
};
export { TrancheTVLDataCard };

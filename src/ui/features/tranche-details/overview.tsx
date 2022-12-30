import { Card } from '../../components/cards';
import React from 'react';
import {
    AssetDisplay,
    HealthFactor,
    MultipleAssetsDisplay,
    NumberDisplay,
} from '../../components/displays';
import { useWindowSize } from '../../../hooks/ui';
import { useDialogController } from '../../../hooks/dialogs';
import { useUserTrancheData } from '../../../api';
import { useAccount } from 'wagmi';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '../../tables';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { makeCompact, usdFormatter } from '../../../utils/helpers';

export interface ITrancheOverviewProps {
    assets?: string[];
    tvl?: number;
    tvlChange?: number;
    supplied?: number;
    supplyChange?: number;
    borrowed?: number;
    borrowChange?: number;
    grade?: string;
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
}) => {
    const { width, breakpoint } = useWindowSize();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { tranche } = useSelectedTrancheContext();
    const {
        queryUserTrancheData: { data },
    } = useUserTrancheData(address, tranche.id);

    const calculateNetAPY = () => {
        if (!data) return `0%`;
        const supplyTotal = data?.supplies.reduce(
            (partial, next) => partial + parseFloat(next.amount.slice(1).replaceAll(',', '')),
            0,
        );
        const supplySum = data?.supplies.reduce(
            (partial, next) =>
                partial + next.apy * parseFloat(next.amount.slice(1).replaceAll(',', '')),
            0,
        );
        const borrowSum = data?.borrows.reduce(
            (partial, next) =>
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

    const buttonClass = `transition duration-150 hover:bg-neutral-100 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-700`;
    const assetDisplayClass = `transition duration-150 py-1 px-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700`;

    return (
        <>
            <Card>
                <div
                    className="flex flex-col flow md:flex-row justify-between font-basefont gap-4 xl:gap-8"
                    style={{ flexFlow: 'wrap' }}
                >
                    <div className="flex flex-col justify-between order-1 min-w-[162px]">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl">Assets</h2>
                            <MultipleAssetsDisplay assets={assets} />
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-around lg:justify-between items-center gap-5 lg:gap-10 xl:gap-16 2xl:gap-20 order-3 lg:order-2 w-full lg:w-auto">
                        <NumberDisplay
                            center
                            size="xl"
                            label="TVL"
                            value={`${makeCompact(tvl, true)}`}
                            change={tvlChange}
                            loading={!tvl}
                        />
                        <NumberDisplay
                            center
                            size="xl"
                            label="Supplied"
                            value={`${makeCompact(supplied, true)}`}
                            change={supplyChange}
                            loading={!supplied}
                        />
                        <NumberDisplay
                            center
                            size="xl"
                            label="Borrowed"
                            value={`${makeCompact(borrowed, true)}`}
                            change={borrowChange}
                            loading={!borrowed}
                        />
                    </div>
                    <div className="order-2 lg:order-3 min-w-[162px] 2xl:min-w-[194px]">
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-col items-end">
                                <h2 className="text-2xl">Grade</h2>
                                <p className="text-3xl">{grade || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {(renderUserInteractions('borrows').length !== 0 ||
                    renderUserInteractions('supplies').length !== 0) && (
                    <>
                        <div className="border-t-2 border-black md:border-0 mt-4" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-center flex flex-col">
                                <span className="text-sm">
                                    {width > breakpoint && 'User '}Supplies
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {renderUserInteractions('supplies').map((el) => (
                                        <button
                                            key={`${el.asset}`}
                                            onClick={() =>
                                                openDialog('loan-asset-dialog', {
                                                    ...el,
                                                    view: 'Withdraw',
                                                })
                                            }
                                            className={buttonClass}
                                        >
                                            <AssetDisplay
                                                className={assetDisplayClass}
                                                name={el.asset}
                                                size="sm"
                                                value={usdFormatter().format(
                                                    parseFloat(
                                                        el.amount.slice(1).replaceAll(',', ''),
                                                    ),
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center flex flex-col">
                                <span className="text-sm">
                                    {width > breakpoint && 'User '}Borrows
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {renderUserInteractions('borrows').map((el) => (
                                        <button
                                            key={`${el.asset}`}
                                            onClick={() =>
                                                openDialog('borrow-asset-dialog', {
                                                    ...el,
                                                    view: 'Repay',
                                                })
                                            }
                                            className={buttonClass}
                                        >
                                            <AssetDisplay
                                                className={assetDisplayClass}
                                                name={el.asset}
                                                size="sm"
                                                value={usdFormatter().format(
                                                    parseFloat(
                                                        el.amount.slice(1).replaceAll(',', ''),
                                                    ),
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center text-sm flex flex-col items-center">
                                <span>
                                    {width > breakpoint && 'User '}Health
                                    {width > breakpoint && ' Factor'}
                                </span>
                                <HealthFactor
                                    value={
                                        parseFloat(data?.healthFactor || '0') < 100
                                            ? data?.healthFactor
                                            : '0'
                                    }
                                    withChange={false}
                                    center
                                />
                            </div>
                            <div className="text-center text-sm flex flex-col items-center">
                                <span>{width > breakpoint && 'User '}Net APY</span>
                                <NumberDisplay value={calculateNetAPY()} />
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </>
    );
};
export { TrancheTVLDataCard };

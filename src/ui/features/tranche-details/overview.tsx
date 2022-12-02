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
import { useWalletState } from '../../../hooks/wallet';
import { IYourBorrowsTableItemProps, IYourSuppliesTableItemProps } from '../../tables';
import { useSelectedTrancheContext } from '../../../store/contexts';
import { usdFormatter } from '../../../utils/helpers';

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
    const { width } = useWindowSize();
    const { openDialog } = useDialogController();
    const { address } = useWalletState();
    const { tranche, setTranche } = useSelectedTrancheContext();
    const {
        queryUserTrancheData: { data, isLoading },
    } = useUserTrancheData(address, tranche.id);

    const breakpoint = 768;
    return (
        <Card>
            <div
                className="flex flex-col flow md:flex-row justify-between font-basefont gap-4 md:gap-8"
                style={{ flexFlow: 'wrap' }}
            >
                <div className="flex flex-col justify-between order-1">
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
                        value={`${tvl}`}
                        change={tvlChange}
                    />
                    <NumberDisplay
                        center
                        size="xl"
                        label="Supplied"
                        value={`${supplied}`}
                        change={supplyChange}
                    />
                    <NumberDisplay
                        center
                        size="xl"
                        label="Borrowed"
                        value={`${borrowed}`}
                        change={borrowChange}
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

            {data && (data?.borrows?.length !== 0 || data?.supplies?.length !== 0) && (
                <div className="grid grid-cols-3 mt-4">
                    <div className="text-center flex flex-col">
                        <span className="text-sm">{width > breakpoint && 'User '}Supplies</span>
                        <div className="flex flex-wrap gap-2">
                            {data?.supplies?.length
                                ? data?.supplies?.length > 0 &&
                                  data.supplies.map((el: IYourSuppliesTableItemProps) => (
                                      <button
                                          key={`${el.asset}`}
                                          onClick={() =>
                                              openDialog('supplied-asset-details-dialog', {
                                                  ...el,
                                              })
                                          }
                                      >
                                          <AssetDisplay
                                              name={el.asset}
                                              size="sm"
                                              value={usdFormatter().format(
                                                  parseFloat(
                                                      el.amount.slice(1).replaceAll(',', ''),
                                                  ),
                                              )}
                                              border
                                          />
                                      </button>
                                  ))
                                : ''}
                        </div>
                    </div>
                    <div className="text-center flex flex-col">
                        <span className="text-sm">{width > breakpoint && 'User '}Borrows</span>
                        <div className="flex flex-wrap gap-2">
                            {data?.borrows?.length
                                ? data?.borrows?.length > 0 &&
                                  data.borrows.map((el: IYourBorrowsTableItemProps) => (
                                      <button
                                          key={`${el.asset}`}
                                          onClick={() =>
                                              openDialog('supplied-asset-details-dialog', {
                                                  ...el,
                                              })
                                          }
                                      >
                                          <AssetDisplay
                                              name={el.asset}
                                              size="sm"
                                              value={usdFormatter().format(
                                                  parseFloat(
                                                      el.amount.slice(1).replaceAll(',', ''),
                                                  ),
                                              )}
                                              border
                                          />
                                      </button>
                                  ))
                                : ''}
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
                        />
                    </div>
                </div>
            )}
        </Card>
    );
};
export { TrancheTVLDataCard };

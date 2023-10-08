import React, { useState } from 'react';
import { Slider as MUISlider } from '@mui/material';
import { AssetDisplay, Button, Card, PillDisplay } from '@/ui/components';
import { capFirstLetter, findInObjArr, percentFormatter } from '@/utils';
import { ModalTableDisplay } from '../modals';
import { useApyData } from '@/api';

type IStrategyCard = {
    asset: string;
    supplyApy: number;
};

export const StrategyCard = ({ asset, supplyApy }: IStrategyCard) => {
    const [leverage, setLeverage] = useState(1);
    const { queryAssetApys } = useApyData();
    const collateralAssets = ['ETH', 'wstETH']; // TODO: get available assets to zap

    const rewardApy = findInObjArr('symbol', asset, queryAssetApys.data);

    return (
        <Card className="h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between">
                    <AssetDisplay name={asset || ''} />
                    <div className="flex flex-col items-end">
                        <span className="text-xs">Max APY</span>
                        <span className="font-medium text-lg">
                            {percentFormatter.format(supplyApy)}
                        </span>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-xs">Leverage</span>
                    <div className="px-2">
                        <MUISlider
                            aria-label="Small steps"
                            defaultValue={1}
                            step={1}
                            marks
                            min={1}
                            max={10}
                            valueLabelDisplay="auto"
                            size="small"
                            value={leverage}
                            onChange={(e) => setLeverage((e.target as any).value || 1)}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-xs leading-tight">
                        Open this strategy by providing any of the assets as collateral:
                    </p>
                    <div className="flex gap-1 flex-wrap mt-1">
                        {collateralAssets.map((el, i) => (
                            <PillDisplay
                                type="asset"
                                asset={el}
                                key={`collateral-asset-${el}-${i}`}
                                size="sm"
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-3 2xl:mt-4 ">
                    <span className="text-xs">APY Breakdown</span>
                    <ModalTableDisplay
                        content={rewardApy.apysByToken
                            .sort((a: any, b: any) => a.symbol.length - b.symbol.length)
                            .map((x: any) => ({
                                label:
                                    x?.symbol?.length >= 5
                                        ? capFirstLetter(x?.symbol) || x.asset
                                        : x?.symbol || x.asset,
                                value: percentFormatter.format(Number(x.apy) / 100),
                            }))}
                        valueClass="text-right"
                        size="sm"
                    />
                </div>
            </div>
            <div className="mt-3 2xl:mt-4 flex w-full">
                <Button label="Supply" className="w-full" primary />
            </div>
        </Card>
    );
};

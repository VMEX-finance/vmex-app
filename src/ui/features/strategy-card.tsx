import React, { useState } from 'react';
import { Slider as MUISlider } from '@mui/material';
import { AssetDisplay, Button, Card, PillDisplay } from '@/ui/components';
import { DEFAULT_CHAINID, capFirstLetter, findInObjArr, percentFormatter } from '@/utils';
import { ModalTableDisplay } from '../modals';
import { useApyData } from '@/api';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useDialogController } from '@/hooks';

type IStrategyCard = {
    asset: string;
    supplyApy: number;
    trancheId: number;
};

export const StrategyCard = ({ asset, supplyApy, trancheId }: IStrategyCard) => {
    const { chain } = useNetwork();
    const { openDialog } = useDialogController();
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();
    const [leverage, setLeverage] = useState(1);
    const { queryAssetApys } = useApyData();

    const rewardApy = findInObjArr('symbol', asset, queryAssetApys.data);

    const getCollateralAssets = () => {
        return ['ETH', 'wstETH']; // TODO: get available assets to zap
    };

    const handleClick = (e: any) => {
        if (!chain && openConnectModal) return openConnectModal();
        else if (chain?.unsupported && switchNetwork) return switchNetwork(DEFAULT_CHAINID);
        return openDialog('loan-asset-dialog', {
            asset,
            trancheId,
            collateral: false /* TODO: add zap and collateral here */,
        });
    };

    const handleBtnText = () => {
        if (!chain && openConnectModal) return 'Connect Wallet';
        else if (chain?.unsupported && switchNetwork) return 'Switch Network';
        return 'Supply';
    };

    const handleCollateralClick = (asset: string) => {
        console.log('asset', asset); // TODO: handle asset zap
    };

    const handleSlide = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        setLeverage((e.target as any).value || 1);
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between">
                    <AssetDisplay name={asset || ''} />
                    <div className="flex flex-col items-end">
                        <span className="text-xs">Max APY</span>
                        <span className="font-medium text-lg">
                            {percentFormatter.format(Number(supplyApy) * leverage)}
                        </span>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-xs flex items-center gap-1">
                        <span>Leverage:</span>
                        <span className="font-medium">{leverage}x</span>
                    </span>
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
                            onChange={handleSlide}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-xs leading-tight">
                        Open this strategy by providing any of the assets as collateral:
                    </p>
                    <div className="flex gap-1 flex-wrap mt-1">
                        {getCollateralAssets()?.map((el, i) => (
                            <button
                                onClick={(e) => handleCollateralClick(el)}
                                key={`collateral-asset-${el}-${i}`}
                            >
                                <PillDisplay type="asset" asset={el} size="sm" hoverable />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-3 2xl:mt-4 ">
                    <span className="text-xs">APY Breakdown</span>
                    <ModalTableDisplay
                        content={rewardApy?.apysByToken
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
                <Button label={handleBtnText()} onClick={handleClick} className="w-full" primary />
            </div>
        </Card>
    );
};

import React, { useEffect, useMemo, useState } from 'react';
import { Slider as MUISlider } from '@mui/material';
import { AssetDisplay, Button, Card, PillDisplay } from '@/ui/components';
import { DEFAULT_CHAINID, capFirstLetter, findInObjArr, percentFormatter, toSymbol } from '@/utils';
import { ModalTableDisplay } from '../modals';
import { useApyData } from '@/api';
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useDialogController } from '@/hooks';
import { formatEther } from 'viem';

type IStrategyCard = {
    asset: string;
    assetAddress: string;
    supplyApy: number;
    trancheId: number;
    token0: string;
    token1: string;
    name: string;
};

export const StrategyCard = ({ asset, assetAddress, supplyApy, trancheId }: IStrategyCard) => {
    const { chain } = useNetwork();
    const { openDialog } = useDialogController();
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();
    const { address } = useAccount();
    const [leverage, setLeverage] = useState(1);
    const { queryAssetApys } = useApyData();
    const [apyBreakdown, setApyBreakdown] = useState<any[]>([]);

    const rewardApy = findInObjArr('asset', assetAddress, queryAssetApys.data);
    const getCollateralAssets = () => {
        // TODO: get available assets to zap
        return ['ETH', 'wstETH'];
    };

    const handleCollateralClick = (asset: string) => {
        setBorrowAsset(asset);
        // TODO visually select this button so user knows
    };

    const handleSupplyClick = (e: any) => {
        if (!chain && openConnectModal) return openConnectModal();
        else if (chain?.unsupported && switchNetwork) return switchNetwork(DEFAULT_CHAINID);
        // TODO: implement supply with zapped asset
        // edit supply modal props accordingly to have appropriate args passed
        return openDialog('loan-asset-dialog', {
            asset,
            trancheId,
            collateral: true,
        });
    };

    const renderBtnText = () => {
        if (!chain && openConnectModal) return 'Connect Wallet';
        else if (chain?.unsupported && switchNetwork) return 'Switch Network';
        return 'Supply';
    };

    const handleSlide = (e: Event) => {
        e.stopPropagation();
        setLeverage((e.target as any).value || 1);
    };

    useEffect(() => {
        if (rewardApy) {
            (async () => {
                const promises = await Promise.all(
                    rewardApy?.apysByToken
                        .sort((a: any, b: any) => a.symbol.length - b.symbol.length)
                        .map(async (x: any) => ({
                            label:
                                x?.symbol?.length >= 5
                                    ? capFirstLetter(x?.symbol) ||
                                      (await toSymbol(x.asset, chain as Chain))
                                    : await toSymbol(x?.symbol || x.asset, chain as Chain),
                            value: percentFormatter.format(Number(x.apy) / 100),
                        })),
                );
                setApyBreakdown(promises);
            })().catch((err) => console.error(err));
        }
    }, [rewardApy]);

    const renderContent = useMemo(async () => {}, [rewardApy]);

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
                            aria-label="leverage slider steps"
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
                        {getCollateralAssets(token0, token1)?.map((el, i) => (
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
                    <ModalTableDisplay content={apyBreakdown} valueClass="text-right" size="sm" />
                </div>
            </div>
            <div className="mt-3 2xl:mt-4 flex w-full">
                <Button
                    label={renderBtnText()}
                    onClick={handleSupplyClick}
                    className="w-full"
                    primary
                />
            </div>
        </Card>
    );
};

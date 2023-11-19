import React, { useEffect, useState } from 'react';
import { Slider as MUISlider } from '@mui/material';
import { AssetDisplay, Button, Card, Label, PillDisplay, Tooltip } from '@/ui/components';
import {
    AVAILABLE_COLLATERAL_TRESHOLD,
    DEFAULT_CHAINID,
    capFirstLetter,
    findInObjArr,
    percentFormatter,
    toSymbol,
} from '@/utils';
import { ModalTableDisplay } from '../modals';
import {
    useApyData,
    usePricesData,
    useSubgraphAllAssetMappingsData,
    useSubgraphAllMarketsData,
    useSubgraphTrancheData,
} from '@/api';
import { Chain, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useDialogController } from '@/hooks';
import { useUserData } from '@/api/user-data';
import { getAddress } from 'ethers/lib/utils.js';
import { useMaxBorrowableAmount } from '@/hooks/max-borrowable';
import { parseUnits } from 'ethers/lib/utils.js';

type IStrategyCard = {
    asset: string;
    assetAddress: string;
    supplyApy: number;
    trancheId: number;
    token0?: string;
    token1?: string;
    name?: string;
    tranche?: string;
};

export const StrategyCard = ({
    asset,
    assetAddress,
    supplyApy,
    trancheId,
    tranche,
    token0,
    token1,
    name,
}: IStrategyCard) => {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const { openDialog } = useDialogController();
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();
    const [leverage, setLeverage] = useState(1);
    const { queryAssetApys } = useApyData();
    const [apyBreakdown, setApyBreakdown] = useState<any[]>([]);
    const [collateral, setCollateral] = useState('');
    const { queryUserActivity } = useUserData(address);
    const { queryAllMarketsData } = useSubgraphAllMarketsData();
    const { queryAllAssetMappingsData } = useSubgraphAllAssetMappingsData();
    const { queryTrancheData } = useSubgraphTrancheData(trancheId);
    const { prices } = usePricesData();

    const isLoopable = token0 && token1 && name;

    const suppliedAssetDetails = queryUserActivity.data?.supplies.find(
        (el) => getAddress(el.assetAddress) === getAddress(assetAddress),
    );

    const assetDetails = queryAllAssetMappingsData.data?.get(name?.toUpperCase() || '');
    const { maxLeverage } = useMaxBorrowableAmount(
        queryUserActivity.data?.availableBorrowsETH,
        '50',
        assetDetails?.baseLTV,
        suppliedAssetDetails?.amount,
    );

    const rewardApy = findInObjArr('asset', assetAddress, queryAssetApys.data);

    const getLeverageDisabled = () => {
        return !suppliedAssetDetails?.amountNative.gt(0) || !collateral;
    };

    const getCollateralAssets = (token0: string, token1: string) => {
        if (!queryAllMarketsData.data || !prices) {
            return [];
        }
        const collateralAssets = [];

        const borrowableAssets = queryAllMarketsData.data.filter((x) => {
            if (x.trancheId !== trancheId.toString() || !x.canBeBorrowed) return false;
            return AVAILABLE_COLLATERAL_TRESHOLD.lt(parseUnits(String(x.available), 8));
        });
        // if both underyling tokens for LP are borrowable, show Underyling
        if (
            borrowableAssets.filter(
                (x) =>
                    x.assetAddress.toLowerCase() === token0.toLowerCase() ||
                    x.assetAddress.toLowerCase() === token1.toLowerCase(),
            ).length === 2
        ) {
            collateralAssets.push({
                assetName: 'Underlying',
                assetAddress: `${token0}:${token1}`,
            });
        }
        collateralAssets.push(
            ...borrowableAssets.map((x) => {
                return { assetName: x.asset, assetAddress: x.assetAddress };
            }),
        );

        collateralAssets.sort((a, b) => {
            if (a.assetName === 'Underlying') return -1;
            if (b.assetName === 'Underyling') return 1;
            if ([token0.toLowerCase(), token1.toLowerCase()].includes(a.assetAddress.toLowerCase()))
                return -1;
            if ([token0.toLowerCase(), token1.toLowerCase()].includes(b.assetAddress.toLowerCase()))
                return 1;
            return 0;
        });

        return collateralAssets;
    };

    const handleCollateralClick = (asset: string) => {
        if (!suppliedAssetDetails) return;
        setCollateral(asset);
    };

    const openLeverageDialog = () => {
        openDialog('leverage-asset-dialog', {
            ...suppliedAssetDetails,
            ...rewardApy,
            apyBreakdown,
            leverage,
            collateral,
            trancheId,
            token0,
            token1,
            tranche: queryTrancheData?.data?.name || '',
        });
        setTimeout(() => setCollateral(''), 2000);
    };

    const handleSupplyClick = (e: any) => {
        if (!chain && openConnectModal) return openConnectModal();
        else if (chain?.unsupported && switchNetwork) return switchNetwork(DEFAULT_CHAINID);
        return openDialog('loan-asset-dialog', {
            asset,
            trancheId,
            tranche: queryTrancheData?.data?.name || '',
            collateral: true,
        });
    };

    const renderBtnText = (isLeverage?: boolean) => {
        if (!chain && openConnectModal) return 'Connect Wallet';
        else if (chain?.unsupported && switchNetwork) return 'Switch Network';
        if (isLeverage) return 'Loop';
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
                            value: percentFormatter.format(Number(x.apy || '0') / 100),
                        })),
                );
                setApyBreakdown(promises);
            })().catch((err) => console.error(err));
        }
    }, [rewardApy]);

    return (
        <Card className="h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between">
                    <AssetDisplay name={asset || ''} />
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Max APY
                        </span>
                        <span className="font-medium text-lg leading-none">
                            {percentFormatter.format(Number(supplyApy) * leverage)}
                        </span>
                    </div>
                </div>
                {isLoopable && (
                    <>
                        <div className="mt-2">
                            <span className="text-xs flex items-center gap-1">
                                <span>Looping:</span>
                                <span className="font-medium">{leverage}x</span>
                            </span>
                            <div className="px-2">
                                <MUISlider
                                    aria-label="looping slider steps"
                                    defaultValue={1}
                                    step={0.25}
                                    marks
                                    min={1}
                                    max={maxLeverage}
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
                                {getCollateralAssets(token0 || '', token1 || '').map((el, i) =>
                                    suppliedAssetDetails ? (
                                        <button
                                            onClick={(e) => handleCollateralClick(el.assetAddress)}
                                            key={`collateral-asset-${el}-${i}`}
                                        >
                                            <PillDisplay
                                                type="asset"
                                                asset={el.assetName}
                                                size="sm"
                                                hoverable={!!suppliedAssetDetails}
                                                selected={
                                                    el.assetAddress.toLowerCase() ===
                                                    collateral.toLowerCase()
                                                }
                                            />
                                        </button>
                                    ) : (
                                        <Tooltip
                                            id={`collateral-tooltip-${i}-${el.assetAddress}-${asset}`}
                                            text="Supply first to start looping"
                                            key={`collateral-tooltip-${i}-${el}-${asset}`}
                                        >
                                            <button
                                                onClick={(e) =>
                                                    handleCollateralClick(el.assetAddress)
                                                }
                                                key={`collateral-asset-${el}-${i}`}
                                                disabled
                                            >
                                                <PillDisplay
                                                    type="asset"
                                                    asset={el.assetName}
                                                    size="sm"
                                                    hoverable={!getLeverageDisabled()}
                                                    selected={
                                                        el.assetAddress.toLowerCase() ===
                                                        collateral.toLowerCase()
                                                    }
                                                />
                                            </button>
                                        </Tooltip>
                                    ),
                                )}
                            </div>
                        </div>
                    </>
                )}
                <div className="mt-2.5">
                    <div className="flex justify-between items-end mx-0.5">
                        <span className="text-xs">APY Breakdown</span>
                        {tranche?.includes('LSD') && (
                            <Label
                                color="blue"
                                tooltip="This asset is effectively used liquid staking derivatives."
                                className="!text-[11px]"
                            >
                                LSD Efficient
                            </Label>
                        )}
                    </div>
                    <ModalTableDisplay content={apyBreakdown} valueClass="text-right" size="sm" />
                </div>
            </div>
            <div className={`mt-3 2xl:mt-4 grid items-center gap-1 w-full grid-cols-1`}>
                <Button
                    onClick={suppliedAssetDetails ? openLeverageDialog : handleSupplyClick}
                    className="w-full"
                    type="accent"
                >
                    {renderBtnText(!!suppliedAssetDetails)}
                </Button>
            </div>
        </Card>
    );
};

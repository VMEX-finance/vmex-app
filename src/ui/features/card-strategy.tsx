import React, { useEffect, useState } from 'react';
import { Slider as MUISlider } from '@mui/material';
import {
    AssetDisplay,
    Button,
    Card,
    Label,
    PillDisplay,
    SmartPrice,
    Tooltip,
} from '@/ui/components';
import {
    AVAILABLE_COLLATERAL_TRESHOLD,
    DEFAULT_CHAINID,
    capFirstLetter,
    findInObjArr,
    isAddressEqual,
    isChainUnsupported,
    percentFormatter,
    processUserLoop,
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
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useDialogController, useZap } from '@/hooks';
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
    loading?: boolean;
    userLoops?: any[];
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
    loading,
    userLoops,
}: IStrategyCard) => {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const { openDialog } = useDialogController();
    const { openChainModal } = useChainModal();
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
    const foundUserLoop = userLoops?.find((loop) =>
        isAddressEqual(loop.depositAssetAddress, assetAddress),
    );
    const currentApy = processUserLoop(
        trancheId,
        assetAddress,
        foundUserLoop,
        queryAllMarketsData.data,
        queryUserActivity.data,
        prices,
    );

    const { zappableAssets, handleZap, zapAsset } = useZap(asset);

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
        const underylingTokensBorrowable = borrowableAssets.filter(
            (x) => isAddressEqual(x.assetAddress, token0) || isAddressEqual(x.assetAddress, token1),
        );
        if (underylingTokensBorrowable.length === 2) {
            borrowableAssets.sort((a, b) => a.assetAddress.localeCompare(b.assetAddress));
            collateralAssets.push({
                assetName: borrowableAssets.map((x) => x.asset).join('/'),
                assetAddress: borrowableAssets.map((x) => x.assetAddress).join(':'),
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
            if (isAddressEqual(token0, a.assetAddress) || isAddressEqual(token1, a.assetAddress))
                return -1;
            if (isAddressEqual(token0, b.assetAddress) || isAddressEqual(token1, b.assetAddress))
                return 1;
            return 0;
        });

        return collateralAssets;
    };

    const handleCollateralClick = (asset: string) => {
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
            maxLeverage,
            foundUserLoop,
        });
        setTimeout(() => setCollateral(''), 2000);
    };

    const handleSupplyClick = (e: any) => {
        if (!chain && openConnectModal) return openConnectModal();
        else if (isChainUnsupported() && openChainModal) return openChainModal();
        return openDialog('loan-asset-dialog', {
            asset,
            trancheId,
            tranche: queryTrancheData?.data?.name || '',
            collateral: true,
            zapAsset,
            zappableAssets,
        });
    };

    const renderBtnText = (isLeverage?: boolean) => {
        if (!chain && openConnectModal) return 'Connect Wallet';
        else if (isChainUnsupported() && openChainModal) return 'Switch Network';
        if (foundUserLoop) return 'Unwind';
        if (isLeverage) return 'Loop';
        return 'Supply / Zap';
    };

    const renderBtnClick = (e: any) => {
        if (suppliedAssetDetails) return openLeverageDialog();
        return handleSupplyClick(e);
    };

    const handleSlide = (e: Event) => {
        e.stopPropagation();
        setLeverage((e.target as any).value || 1);
    };

    const renderText = () => {
        if (!address) return '';
        if (foundUserLoop) return `Currently looping ${asset} with this asset as collateral:`;
        return suppliedAssetDetails
            ? 'Select one of the following assets to borrow and use as collateral:'
            : `Select one of the following assets to zap into ${asset}:`;
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
                                    ? capFirstLetter(x?.symbol) || toSymbol(x.asset)
                                    : toSymbol(x?.symbol || x.asset),
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
                            {currentApy ? 'Current Apy' : 'Max APY'}
                        </span>
                        <span className="font-medium text-lg leading-none">
                            {currentApy
                                ? currentApy
                                : percentFormatter.format(Number(supplyApy) * leverage)}
                        </span>
                    </div>
                </div>
                {isLoopable && (
                    <>
                        <div className="mt-2">
                            {foundUserLoop ? (
                                <div className="min-h-[51px] flex flex-col items-start justify-center">
                                    <span className="text-xs flex gap-0.5 items-center">
                                        <span className="font-semibold">Supply:</span>{' '}
                                        <SmartPrice price={foundUserLoop.depositAmountNative} />{' '}
                                        {foundUserLoop.depositAsset}
                                    </span>
                                    <span className="text-xs flex gap-0.5 items-center">
                                        <span className="font-semibold">Borrow:</span>{' '}
                                        <SmartPrice price={foundUserLoop.borrowAmountNative} />{' '}
                                        {foundUserLoop.borrowAsset}
                                    </span>
                                </div>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                        <div>
                            <p className="text-xs leading-tight">{renderText()}</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                                {suppliedAssetDetails
                                    ? getCollateralAssets(token0, token1).map((el, i) => (
                                          <button
                                              onClick={(e) =>
                                                  handleCollateralClick(el.assetAddress)
                                              }
                                              key={`collateral-asset-${el}-${i}`}
                                          >
                                              <PillDisplay
                                                  type="asset"
                                                  asset={el.assetName}
                                                  size="sm"
                                                  hoverable={!!suppliedAssetDetails}
                                                  selected={
                                                      el.assetAddress.toLowerCase() ===
                                                          collateral.toLowerCase() ||
                                                      el.assetAddress.toLowerCase() ===
                                                          foundUserLoop?.borrowAssetAddress?.toLowerCase()
                                                  }
                                              />
                                          </button>
                                      ))
                                    : zappableAssets.map((el, i) => (
                                          <button
                                              key={`top-supplied-asset-${i}`}
                                              onClick={(e) =>
                                                  el.amount === '$0.00' ? {} : handleZap(e, el)
                                              }
                                              disabled={el.amount === '$0.00'}
                                          >
                                              <PillDisplay
                                                  type="asset"
                                                  asset={el.symbol}
                                                  hoverable={el.amount !== '$0.00'}
                                                  selected={
                                                      el.address?.toLowerCase() ===
                                                          zapAsset?.address.toLowerCase() ||
                                                      el.address.toLowerCase() ===
                                                          foundUserLoop?.borrowAssetAddress?.toLowerCase()
                                                  }
                                              />
                                          </button>
                                      ))}
                            </div>
                        </div>
                    </>
                )}
                <div className="mt-2.5">
                    <div className="flex justify-between items-end mx-0.5 mb-0.5">
                        <span className="text-xs">APY Breakdown</span>
                        {tranche?.includes('LSD') && (
                            <Label
                                color="pink"
                                tooltip="Risk parameters specially tuned for optimal borrow / lend use of LSDs."
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
                <Button onClick={renderBtnClick} className="w-full" type="accent">
                    {renderBtnText(!!suppliedAssetDetails)}
                </Button>
            </div>
        </Card>
    );
};

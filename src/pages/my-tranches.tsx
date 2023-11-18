import React, { useEffect } from 'react';
import { Base } from '@/ui/base';
import {
    Button,
    Card,
    DefaultDropdown,
    DefaultInput,
    ListInput,
    MessageStatus,
    SkeletonLoader,
    TransactionStatus,
    WalletButton,
} from '@/ui/components';
import { useAccount, useSigner } from 'wagmi';
import { useSubgraphUserData, IGraphAssetData, useSubgraphTrancheData, AssetBalance } from '@/api';
import { useModal, useWindowSize } from '@/hooks';
import { TrancheStatsCard } from '@/ui/features';
import { CreateTrancheAssetsTable } from '@/ui/tables';
import { ethers } from 'ethers';
import { configureExistingTranche, SetAddress } from '@vmexfinance/sdk';
import {
    NETWORKS,
    AVAILABLE_ASSETS,
    checkProfanity,
    nativeAmountToUSD,
    PRICING_DECIMALS,
    getNetworkName,
} from '../utils';
import { useAnalyticsEventTracker } from '@/config';
import { getNetwork } from '@wagmi/core';

const MyTranches: React.FC = () => {
    const network = getNetworkName();
    const gaEventTracker = useAnalyticsEventTracker('My Tranches');
    const breakpoint = 1024;
    const { width } = useWindowSize();
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { isSuccess, error, submitTx, setError, isLoading } = useModal('my-tranches-dialog');
    const { queryTrancheAdminData } = useSubgraphUserData(address || '');
    const [selectedTranche, setSelectedTranche] = React.useState(
        queryTrancheAdminData.data && queryTrancheAdminData.data.length > 0
            ? queryTrancheAdminData.data[0]
            : {},
    );
    const { queryTrancheChart } = useSubgraphTrancheData(selectedTranche?.id as any);

    function getTopItems(metric: string, n: number) {
        if (!selectedTranche.assetsData) return [];

        let top: AssetBalance[] = [];
        Object.keys(selectedTranche.assetsData || {}).map((asset) => {
            const assetData = (selectedTranche.assetsData as any)[asset];
            top.push({
                asset: asset,
                amount: nativeAmountToUSD(
                    ethers.utils.parseUnits(assetData[metric], assetData.decimals),
                    PRICING_DECIMALS[network],
                    assetData.decimals,
                    assetData.priceUSD,
                ).toString(),
            });
        });

        top.sort((a, b) => {
            return Number(b.amount) - Number(a.amount);
        });

        return top.slice(0, n);
    }

    function getFrozenTokens() {
        return selectedTranche.assets
            ? selectedTranche.assets.filter(
                  (el: string) =>
                      (selectedTranche.assetsData as Record<string, IGraphAssetData>)[el].isFrozen,
              )
            : [];
    }

    function getCollateralTokens() {
        return selectedTranche.assets
            ? selectedTranche.assets.filter(
                  (el: string) =>
                      (selectedTranche.assetsData as Record<string, IGraphAssetData>)[el]
                          .collateral,
              )
            : [];
    }

    function getBorrowableTokens() {
        return selectedTranche.assets
            ? selectedTranche.assets.filter(
                  (el: string) =>
                      (selectedTranche.assetsData as Record<string, IGraphAssetData>)[el]
                          .canBeBorrowed,
              )
            : [];
    }

    function getAdminFees() {
        return selectedTranche.assets
            ? selectedTranche.assets.map((el: string) =>
                  ethers.utils.formatUnits(
                      (selectedTranche.assetsData as Record<string, IGraphAssetData>)[el]
                          .reserveFactor,
                      16,
                  ),
              )
            : [];
    }

    function getOriginalAndNewTokens() {
        return selectedTranche.assets && [...selectedTranche.assets, ..._newTokens];
    }

    const [_name, setName] = React.useState(selectedTranche.name);
    const [treasuryAddress, setTreasuryAddress] = React.useState(selectedTranche.treasury);
    const [_isUsingWhitelist, setIsUsingWhitelist] = React.useState(selectedTranche.whitelist);
    const [_whitelisted, setWhitelisted] = React.useState(selectedTranche.whitelistedUsers);
    const [_blackListed, setBlackListed] = React.useState(selectedTranche.blacklistedUsers);
    const [_newTokens, setNewTokens] = React.useState([]);
    const [_adminFee, setAdminFee] = React.useState(getAdminFees());
    const [_frozenTokens, setFrozenTokens] = React.useState(getFrozenTokens());
    const [_collateralTokens, setCollateralTokens] = React.useState(getCollateralTokens());
    const [_borrowableTokens, setBorrowableTokens] = React.useState(getBorrowableTokens());

    const findSelectedTranche = (id: string | number | undefined) => {
        const found = queryTrancheAdminData.data?.find((el) => el.id === id);
        if (found) setSelectedTranche(found);
    };

    function findChanges(newProp: any, originalProp: any): SetAddress[] {
        const newItems = originalProp
            ? newProp.filter((el: any) => !(originalProp as any).includes(el))
            : newProp;
        const deletedItems =
            originalProp && (originalProp as any).filter((el: any) => !newProp.includes(el));
        return [
            ...newItems.map((el: string) => {
                return {
                    addr: el,
                    value: true,
                };
            }),
            ...deletedItems.map((el: string) => {
                return {
                    addr: el,
                    value: false,
                };
            }),
        ];
    }

    function findExistingReserveFactorChanges(): SetAddress[] {
        if (!selectedTranche.assets) {
            return [];
        }
        const originalReserveFactors = getAdminFees();
        let ret: SetAddress[] = [];
        for (let i = 0; i < originalReserveFactors.length; i++) {
            if (originalReserveFactors[i] != _adminFee[i]) {
                ret.push({
                    addr: selectedTranche.assets[i],
                    newValue: (Number(_adminFee[i]) * 100).toFixed(0),
                });
            }
        }
        return ret;
    }

    const handleSave = async () => {
        if (!_name) setError('Please enter a tranche name.');
        if (checkProfanity(_name || '')) setError('Please stop degening.');

        if (selectedTranche.id && signer) {
            await submitTx(async () => {
                const res = await configureExistingTranche({
                    trancheId: selectedTranche.id as any,
                    newName: _name === selectedTranche.name ? undefined : _name,
                    newTreasuryAddress:
                        treasuryAddress === selectedTranche.treasury ? undefined : treasuryAddress,
                    isTrancheWhitelisted:
                        _isUsingWhitelist === selectedTranche.whitelist
                            ? undefined
                            : _isUsingWhitelist,
                    whitelisted: findChanges(_whitelisted, selectedTranche.whitelistedUsers),
                    blacklisted: findChanges(_blackListed, selectedTranche.blacklistedUsers),
                    reserveFactors: findExistingReserveFactorChanges(),
                    canBorrow: findChanges(
                        _borrowableTokens.filter(
                            //only take the tokens in the original set
                            (el) => selectedTranche.assets?.includes(el),
                        ),
                        getBorrowableTokens(),
                    ),
                    canBeCollateral: findChanges(
                        _collateralTokens.filter(
                            //only take the tokens in the original set
                            (el) => selectedTranche.assets?.includes(el),
                        ),
                        getCollateralTokens(),
                    ),
                    isFrozen: findChanges(
                        _frozenTokens.filter(
                            //only take the tokens in the original set
                            (el) => selectedTranche.assets?.includes(el),
                        ),
                        getFrozenTokens(),
                    ),
                    admin: signer,
                    network,
                    test: NETWORKS[network].testing,
                    providerRpc: NETWORKS[network].rpc,
                });
                return res;
            }, false);

            //also submit tx to configure new reserves
        }
    };

    const handleDelete = async () => {
        // await submitTx(async () => {
        //     const res = await deleteTranche(selectedTranche.id);
        //     return res;
        // });
    };

    const handlePause = async () => {
        // await submitTx(async () => {
        //     const res = await pauseTranche(selectedTranche.id);
        //     return res;
        // }, false);
    };

    useEffect(() => {
        setName(selectedTranche.name);
        setWhitelisted(selectedTranche.whitelistedUsers);
        setBlackListed(selectedTranche.blacklistedUsers);
        setAdminFee(getAdminFees());
        setFrozenTokens(getFrozenTokens());
        setCollateralTokens(getCollateralTokens());
        setBorrowableTokens(getBorrowableTokens());
        setTreasuryAddress(selectedTranche.treasury);
        setIsUsingWhitelist(selectedTranche.whitelist);
    }, [selectedTranche, selectedTranche.assets, selectedTranche.assetsData]);

    useEffect(() => {
        if (queryTrancheAdminData?.data && queryTrancheAdminData.data.length > 0)
            setSelectedTranche(queryTrancheAdminData.data[0]);
    }, [queryTrancheAdminData.isLoading]);

    return (
        <Base
            title="My Tranches"
            description={selectedTranche.name && `${selectedTranche.name}`}
            descriptionLoading={queryTrancheAdminData.isLoading}
        >
            {address ? (
                <>
                    {width < breakpoint && (
                        <DefaultDropdown
                            items={
                                queryTrancheAdminData.data?.map((obj) => ({
                                    ...obj,
                                    text: obj.name,
                                    onClick: () => findSelectedTranche(obj.id),
                                })) || []
                            }
                            selected={selectedTranche.name}
                            direction="right"
                            size="lg"
                            primary
                            full
                            title="Select a tranche"
                            wrapperClass="mt-0"
                        />
                    )}
                    <div className="flex gap-4 lg:gap-8">
                        <>
                            {width >= breakpoint && (
                                <Card
                                    title="Select a tranche"
                                    className="flex flex-col min-w-[320px] w-[320px] max-w-[320px] overflow-y-auto"
                                >
                                    <div className="flex justify-between border-b-2 border-neutral-300 dark:border-neutral-800 text-sm text-neutral-500 my-2">
                                        <span>Name</span>
                                        <span>ID</span>
                                    </div>
                                    {queryTrancheAdminData.data ? (
                                        queryTrancheAdminData.data.map((obj, i) => (
                                            <button
                                                className={`
                                                flex justify-between py-2 transition duration-100
                                                ${
                                                    selectedTranche.id === obj.id
                                                        ? 'text-brand-purple'
                                                        : 'hover:text-neutral-700 dark:hover:text-neutral-400'
                                                }
                                                `}
                                                onClick={(e: any) => findSelectedTranche(obj.id)}
                                                key={`my-tranches-${i}`}
                                            >
                                                <span>{obj.name}</span>
                                                <span>{obj.id}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <SkeletonLoader height="42px" />
                                    )}
                                </Card>
                            )}
                            <div className="flex flex-col gap-4 w-full">
                                <TrancheStatsCard
                                    tvl={selectedTranche.tvl}
                                    reserve={
                                        selectedTranche.assets
                                            ? selectedTranche.assets.length.toString()
                                            : '0'
                                    }
                                    lenders={selectedTranche.uniqueLenders}
                                    borrowers={selectedTranche.uniqueBorrowers}
                                    totalSupplied={selectedTranche.totalSupplied}
                                    totalBorrowed={selectedTranche.totalBorrowed}
                                    topBorrowedAssets={getTopItems('totalBorrowed', 3)}
                                    topSuppliedAssets={getTopItems('totalSupplied', 3)}
                                    tvlChart={queryTrancheChart}
                                    isLoading={queryTrancheAdminData.isLoading}
                                />
                                {selectedTranche.name && (
                                    <Card>
                                        {!isSuccess && !error ? (
                                            // Default State
                                            <>
                                                <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2 2xl:items-start">
                                                    <div>
                                                        <DefaultInput
                                                            value={_name || ''}
                                                            onType={setName}
                                                            size="2xl"
                                                            placeholder="VMEX High Quality..."
                                                            title="Name"
                                                            className="flex w-full flex-col"
                                                        />
                                                        <MessageStatus
                                                            type="error"
                                                            show={checkProfanity(_name || '')}
                                                            message="Please keep your degen to a minimum"
                                                        />
                                                    </div>
                                                    <div>
                                                        <DefaultInput
                                                            value={treasuryAddress || ''}
                                                            onType={setTreasuryAddress}
                                                            size="2xl"
                                                            placeholder=""
                                                            title="Treasury Address"
                                                            required
                                                            className="flex w-full flex-col"
                                                        />
                                                    </div>
                                                </div>
                                                <ListInput
                                                    title="Whitelisted"
                                                    list={_whitelisted}
                                                    setList={setWhitelisted}
                                                    placeholder="0x..."
                                                    toggle
                                                    setWhitelisting={setIsUsingWhitelist}
                                                />
                                                <ListInput
                                                    title="Blacklisted"
                                                    list={_blackListed}
                                                    setList={setBlackListed}
                                                    placeholder="0x..."
                                                    toggle
                                                />
                                                <ListInput
                                                    title="Tokens"
                                                    list={_newTokens}
                                                    autocomplete={AVAILABLE_ASSETS[network]
                                                        .map((el) => el.symbol)
                                                        .filter((val: any) => {
                                                            const tmp = getOriginalAndNewTokens();
                                                            return (
                                                                tmp &&
                                                                !(tmp as string[]).includes(val)
                                                            );
                                                        })}
                                                    setList={setNewTokens}
                                                    placeholder="USDC"
                                                    coin
                                                    _adminFee={_adminFee}
                                                    setAdminFee={setAdminFee}
                                                    originalList={selectedTranche.assets}
                                                    noDelete
                                                />
                                                <CreateTrancheAssetsTable
                                                    title="Configure Tokens"
                                                    assets={_newTokens || []}
                                                    setAssets={setNewTokens}
                                                    collateralAssets={_collateralTokens}
                                                    lendAssets={_borrowableTokens}
                                                    lendClick={setBorrowableTokens}
                                                    collateralClick={setCollateralTokens}
                                                    _adminFee={_adminFee}
                                                    setAdminFee={setAdminFee}
                                                    originalAssets={selectedTranche.assets}
                                                    showFrozen
                                                    _frozenTokens={_frozenTokens}
                                                    setFrozenTokens={setFrozenTokens}
                                                />
                                            </>
                                        ) : (
                                            <div className="mt-10 mb-8">
                                                <TransactionStatus
                                                    success={isSuccess}
                                                    errorText={error}
                                                    full
                                                />
                                            </div>
                                        )}

                                        {error && !isSuccess && (
                                            <p className="text-red-500">
                                                {error || 'Invalid input'}
                                            </p>
                                        )}
                                        <div className="mt-6 flex justify-end gap-3">
                                            <Button
                                                disabled={isSuccess}
                                                onClick={handlePause}
                                                type="danger"
                                                loading={isLoading}
                                            >
                                                {selectedTranche.isPaused
                                                    ? 'Unpause Tranche'
                                                    : 'Pause Tranche'}
                                            </Button>
                                            <Button
                                                disabled={isSuccess}
                                                onClick={handleSave}
                                                loading={isLoading}
                                                type="accent"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </>
                    </div>
                </>
            ) : (
                <div className="pt-10 lg:pt-20 text-center flex-col">
                    <div className="mb-4">
                        <span className="text-lg lg:text-2xl">
                            {getNetwork()?.chain?.unsupported
                                ? 'Please switch networks'
                                : 'Please connect your wallet'}
                        </span>
                    </div>
                    <WalletButton className="w-fit" />
                </div>
            )}
        </Base>
    );
};
export default MyTranches;

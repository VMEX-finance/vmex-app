import { IAvailableCoins } from '@/utils';
import React, { useEffect } from 'react';
import { Checkbox, AssetDisplay, DefaultInput, Card } from '@/ui/components';
import { useSubgraphAllAssetMappingsData } from '@/api';

type ICreateTrancheAssetsTableProps = {
    assets: IAvailableCoins[];
    setAssets?: React.Dispatch<React.SetStateAction<any>>;
    lendAssets: IAvailableCoins[];
    collateralAssets: IAvailableCoins[];
    lendClick: React.Dispatch<React.SetStateAction<any>>;
    collateralClick: React.Dispatch<React.SetStateAction<any>>;
    _adminFee: string[];
    setAdminFee: React.Dispatch<React.SetStateAction<any>>;
    title?: string;
    originalAssets?: IAvailableCoins[];
    showFrozen?: boolean;
    _frozenTokens?: IAvailableCoins[];
    setFrozenTokens?: React.Dispatch<React.SetStateAction<any>>;
    wrapperClass?: string;
};

export const CreateTrancheAssetsTable = ({
    assets,
    setAssets,
    lendAssets,
    collateralAssets,
    lendClick,
    collateralClick,
    _adminFee,
    setAdminFee,
    title,
    originalAssets,
    showFrozen = false,
    _frozenTokens,
    setFrozenTokens,
    wrapperClass,
}: ICreateTrancheAssetsTableProps) => {
    const { queryAllAssetMappingsData } = useSubgraphAllAssetMappingsData();

    useEffect(() => {
        lendClick(assets);
        collateralClick(assets);
    }, [assets]);

    const isInList = (asset: IAvailableCoins, list?: IAvailableCoins[]) =>
        list && list.includes(asset) ? true : false;

    const addToList = (
        asset: IAvailableCoins,
        list: IAvailableCoins[],
        setter?: React.Dispatch<React.SetStateAction<any>>,
    ) => {
        const shallow = list.length > 0 ? [...list] : [];
        shallow.push(asset);
        if (setter) {
            setter(shallow);
            return;
        }
        (list === lendAssets ? lendClick : collateralClick)?.(shallow as any);
    };

    const removeFromList = (
        asset: IAvailableCoins,
        list: IAvailableCoins[],
        setter?: React.Dispatch<React.SetStateAction<any>>,
    ) => {
        const shallow = list.length > 0 ? [...list] : [];
        const removed = (shallow as any).filter((e: string) => e !== asset);
        if (setter) {
            setter(removed);
            return;
        }
    };

    const canBeCollateral = (asset: IAvailableCoins) => {
        return queryAllAssetMappingsData.data?.get(asset.toUpperCase())?.baseLTV.toString() != '0';
    };

    const canBeBorrowed = (asset: IAvailableCoins) => {
        return queryAllAssetMappingsData.data?.get(asset.toUpperCase())?.canBeBorrowed;
    };

    function handleSetAdminFee(e: any, i: number) {
        const newVal = e;
        const shallow = _adminFee.length > 0 ? [..._adminFee] : [];
        shallow[i] = newVal;
        setAdminFee(shallow);
    }

    return (
        <>
            <div className="flex justify-between items-end">
                <h3 className="mt-6 mb-1">{title}</h3>
            </div>
            <Card
                type="inner"
                className={`${wrapperClass ? wrapperClass : ''} max-h-60 overflow-y-auto`}
            >
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="text-left">Asset</th>
                            <th className="text-left">Borrow / Lend</th>
                            <th className="text-left">Collateral</th>
                            {showFrozen && <th className="text-left">Frozen</th>}
                            <th className="flex justify-end">Admin Fee (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(originalAssets ? [...originalAssets, ...assets] : assets).map((el, i) => (
                            <tr key={i}>
                                <td>
                                    <AssetDisplay name={el} size="sm" />
                                </td>
                                <td>
                                    <>
                                        <Checkbox
                                            disabled={!canBeBorrowed(el)}
                                            checked={isInList(el, lendAssets)}
                                            label={
                                                canBeBorrowed(el) && isInList(el, lendAssets)
                                                    ? 'Enabled'
                                                    : 'Disabled'
                                            }
                                            onClick={(e: any) => {
                                                isInList(el, lendAssets)
                                                    ? removeFromList(el, lendAssets, lendClick)
                                                    : addToList(el, lendAssets);
                                            }}
                                        />
                                    </>
                                </td>
                                <td>
                                    <>
                                        <Checkbox
                                            disabled={!canBeCollateral(el)}
                                            checked={isInList(el, collateralAssets)}
                                            label={
                                                canBeCollateral(el) &&
                                                isInList(el, collateralAssets)
                                                    ? 'Enabled'
                                                    : 'Disabled'
                                            }
                                            onClick={(e: any) => {
                                                isInList(el, collateralAssets)
                                                    ? removeFromList(
                                                          el,
                                                          collateralAssets,
                                                          collateralClick,
                                                      )
                                                    : addToList(el, collateralAssets);
                                            }}
                                        />
                                    </>
                                </td>
                                {showFrozen && (
                                    <td>
                                        <>
                                            <Checkbox
                                                checked={isInList(el, _frozenTokens)}
                                                label={
                                                    isInList(el, _frozenTokens)
                                                        ? 'Frozen'
                                                        : 'Not Frozen'
                                                }
                                                onClick={(e: any) => {
                                                    // e.preventDefault();
                                                    isInList(el, _frozenTokens)
                                                        ? removeFromList(
                                                              el,
                                                              _frozenTokens || [],
                                                              setFrozenTokens,
                                                          )
                                                        : addToList(
                                                              el,
                                                              _frozenTokens || [],
                                                              setFrozenTokens,
                                                          );
                                                }}
                                            />
                                        </>
                                    </td>
                                )}
                                <td className="flex justify-end">
                                    <DefaultInput
                                        type="percent"
                                        className="flex items-center gap-2 cursor-pointer max-w-[72px]"
                                        value={_adminFee[i]}
                                        onType={(e: any) => handleSetAdminFee(e, i)}
                                        placeholder="0.00"
                                        tooltip="Admin fees will be distributed to the wallet address used to create the tranche. Admin fees set are additive to the base 5% fee taken by VMEX"
                                        required
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <ListInput
                list={assets}
                setList={setAssets}
                placeholder="USDC"
                coin
                autocomplete={AVAILABLE_ASSETS[network].map(el => el.symbol).filter((val) => !(assets as any).includes(val))}
                _adminFee={_adminFee}
                setAdminFee={setAdminFee}
            /> */}
            </Card>

            {!originalAssets && assets.length === 0 && (
                <div className="mt-6 flex justify-center">
                    <span className="text-center">Please go back and add at least one token.</span>
                </div>
            )}
        </>
    );
};

import { IAvailableCoins } from '../../../utils/helpers';
import React, { useEffect } from 'react';
import { Checkbox, AssetDisplay, DefaultInput, MessageStatus } from '../../components';
import { useSubgraphAllAssetMappingsData } from '../../../api/subgraph/getAssetMappingsData';

// TODO: make a way to see which assets cannot be lent / collateralized / etc
type ICreateTrancheAssetsTableProps = {
    assets: IAvailableCoins[];
    lendAssets: IAvailableCoins[];
    collateralAssets: IAvailableCoins[];
    lendClick?: React.Dispatch<React.SetStateAction<any>>;
    collateralClick?: React.Dispatch<React.SetStateAction<any>>;
    _adminFee: string[];
    setAdminFee: React.Dispatch<React.SetStateAction<any>>;
};

export const CreateTrancheAssetsTable = ({
    assets,
    lendAssets,
    collateralAssets,
    lendClick,
    collateralClick,
    _adminFee,
    setAdminFee,
}: ICreateTrancheAssetsTableProps) => {
    const { queryAllAssetMappingsData } = useSubgraphAllAssetMappingsData();

    useEffect(() => {
        lendClick?.(assets);
        collateralClick?.(assets);
    }, [assets]);

    const isInList = (asset: IAvailableCoins, list?: IAvailableCoins[]) =>
        list && list.includes(asset) ? true : false;

    const addToList = (asset: IAvailableCoins, list: IAvailableCoins[]) => {
        const shallow = list.length > 0 ? [...list] : [];
        shallow.push(asset);
        (list == lendAssets ? lendClick : collateralClick)?.(shallow as any);
    };

    const removeFromList = (asset: IAvailableCoins, list: IAvailableCoins[]) => {
        const shallow = list.length > 0 ? [...list] : [];
        const removed = (shallow as any).filter((e: string) => e !== asset);
        (list == lendAssets ? lendClick : collateralClick)?.(removed as any);
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
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Borrow / Lend</th>
                        <th>Collateral</th>
                        <th>Admin Fee (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((el, i) => (
                        <tr key={i}>
                            <td>
                                <AssetDisplay name={el} size="sm" />
                            </td>
                            <td>
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
                                            ? removeFromList(el, lendAssets)
                                            : addToList(el, lendAssets);
                                    }}
                                />
                            </td>
                            <td>
                                <Checkbox
                                    disabled={!canBeCollateral(el)}
                                    checked={isInList(el, collateralAssets)}
                                    label={
                                        canBeCollateral(el) && isInList(el, collateralAssets)
                                            ? 'Enabled'
                                            : 'Disabled'
                                    }
                                    onClick={() => {
                                        isInList(el, collateralAssets)
                                            ? removeFromList(el, collateralAssets)
                                            : addToList(el, collateralAssets);
                                    }}
                                />
                            </td>
                            <td>
                                <DefaultInput
                                    type="percent"
                                    className="flex items-center gap-2 cursor-pointer max-w-[80px]"
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

            {assets.length === 0 && (
                <div className="mt-6 flex justify-center">
                    <span className="text-center">Please go back and add at least one token.</span>
                </div>
            )}
        </>
    );
};

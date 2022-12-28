import { IAvailableCoins } from '../../../utils/helpers';
import React from 'react';
import { Checkbox } from '../../components/buttons';
import { AssetDisplay } from '../../components/displays';

// TODO: make a way to see which assets cannot be lent / collateralized / etc
type ICreateTrancheAssetsTableProps = {
    assets: IAvailableCoins[];
    lendAssets: IAvailableCoins[];
    collateralAssets: IAvailableCoins[];
    lendClick?: React.Dispatch<React.SetStateAction<any>>;
    collateralClick?: React.Dispatch<React.SetStateAction<any>>;
};

export const CreateTrancheAssetsTable = ({
    assets,
    lendAssets,
    collateralAssets,
    lendClick,
    collateralClick,
}: ICreateTrancheAssetsTableProps) => {
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

    return (
        <>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Borrow / Lend</th>
                        <th>Collateral</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((el, i) => (
                        <tr key={i}>
                            <td>
                                <AssetDisplay name={el} size="sm" />
                            </td>
                            <td>
                                <button
                                    onClick={() =>
                                        isInList(el, lendAssets)
                                            ? removeFromList(el, lendAssets)
                                            : addToList(el, lendAssets)
                                    }
                                    className="cursor-pointer"
                                >
                                    <Checkbox
                                        checked={isInList(el, lendAssets)}
                                        label={isInList(el, lendAssets) ? 'Enabled' : 'Disabled'}
                                    />
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() =>
                                        isInList(el, collateralAssets)
                                            ? removeFromList(el, collateralAssets)
                                            : addToList(el, collateralAssets)
                                    }
                                >
                                    <Checkbox
                                        checked={isInList(el, collateralAssets)}
                                        label={
                                            isInList(el, collateralAssets) ? 'Enabled' : 'Disabled'
                                        }
                                    />
                                </button>
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

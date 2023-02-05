import { useSubgraphTrancheData, useUserData, useUserTrancheData } from '../../../api';
import { useAccount } from 'wagmi';
import React from 'react';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { useSelectedTrancheContext } from '../../../store';
import { AssetDisplay, NumberAndDollar } from '../../components';
import { useWindowSize, useDialogController } from '../../../hooks';
import { AvailableAsset } from '@app/api/types';
import { BigNumber, ethers } from 'ethers';
import { numberFormatter, bigNumberToNative, determineCoinImg } from '../../../utils';
import { useLocation } from 'react-router-dom';
import { IYourSuppliesTableItemProps } from '../portfolio';

interface ITableProps {
    data: AvailableAsset[];
    type: 'supply' | 'borrow';
}
export const TrancheTable: React.FC<ITableProps> = ({ data, type }) => {
    const location = useLocation();
    const { width, breakpoint } = useWindowSize();
    const { address } = useAccount();
    const { tranche } = useSelectedTrancheContext();
    const { queryUserWallet, getTokenBalance } = useUserData(address);
    const { queryUserTrancheData, findAmountBorrowable, findAssetInUserSuppliesOrBorrows } =
        useUserTrancheData(address, location.state?.trancheId);
    const { findAssetInMarketsData } = useSubgraphTrancheData(location.state?.trancheId);
    const { openDialog } = useDialogController();

    const mode1 =
        type === 'supply'
            ? width > breakpoint
                ? 'Wallet Balance'
                : 'Balance'
            : width > breakpoint
            ? 'Available Borrows'
            : 'Available';

    const mode2 =
        type === 'supply'
            ? width > breakpoint
                ? 'Can Collateralize'
                : 'Collateral'
            : width > breakpoint
            ? 'Total liquidity'
            : 'Liquidity';

    const isCollateralized = (asset: string) =>
        type === 'supply' &&
        (findAssetInUserSuppliesOrBorrows(asset || '', 'supply') as IYourSuppliesTableItemProps)
            ?.collateral;

    const isSuppliedOrBorrowed = (asset: string) => {
        if (!queryUserTrancheData.data) return false;
        const list = (
            type === 'borrow'
                ? queryUserTrancheData.data.borrows
                : queryUserTrancheData.data.supplies
        ).map((el) => el.asset);

        return list.includes(asset) ? true : false;
    };

    const amountBorrwable = (asset: string) => {
        return findAmountBorrowable(
            asset,
            findAssetInMarketsData(asset).liquidity,
            findAssetInMarketsData(asset).decimals,
            findAssetInMarketsData(asset).priceUSD,
        );
    };

    const compareListsSorter = (a: any, b: any) => {
        if (isSuppliedOrBorrowed(a.asset)) return -1;
        if (isSuppliedOrBorrowed(b.asset)) return 1;
        return 0;
    };

    // Uncomment if want to enable collateral toggle from the table
    // const handleCollateral = async (el: AvailableAsset, index: number) => {
    //     const { asset, canBeCollat } = el;
    //     if (signer && location.state?.trancheId) {
    //         let newArr = [...checked]; // copying the old datas array
    //         newArr[index] = !newArr[index];
    //         await submitTx(async () => {
    //             const res = await markReserveAsCollateral({
    //                 signer: signer,
    //                 network: NETWORK,
    //                 asset: asset,
    //                 trancheId: location.state?.trancheId,
    //                 useAsCollateral: newArr[index],
    //                 test: SDK_PARAMS.test,
    //                 providerRpc: SDK_PARAMS.providerRpc,
    //             });
    //             setChecked(newArr);
    //             return res;
    //         });
    //     }
    // };

    // React.useEffect(() => {
    //     if (data.length > 0) {
    //         const initialState = data.map((el) => el.canBeCollat ? el.canBeCollat : false);
    //         setChecked(initialState);
    //     }
    // }, [data]);

    return (
        <table
            className={`min-w-full divide-y-2 divide-neutral-200 dark:divide-neutral-800 font-basefont`}
        >
            <thead className="">
                <tr className="text-neutral900 text-sm font-semibold text-left">
                    <th scope="col" className="py-3.5 pl-4 sm:pl-6">
                        Asset
                    </th>
                    <th scope="col" className="py-3.5">
                        {mode1}
                    </th>
                    <th scope="col" className="py-3.5">
                        APY
                    </th>
                    <th scope="col" className="py-3.5">
                        {mode2}
                    </th>
                    <th scope="col" className="py-3.5"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {data &&
                    data.sort(compareListsSorter).map((el, i) => {
                        return (
                            <tr
                                key={`${el.asset}-${i}`}
                                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                                onClick={() =>
                                    openDialog(
                                        type === 'supply'
                                            ? 'loan-asset-dialog'
                                            : 'borrow-asset-dialog',
                                        {
                                            asset: el.asset,
                                            trancheId: tranche.id,
                                            collateral: el.canBeCollat,
                                        },
                                    )
                                }
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="flex flex-col justify-center">
                                            {isSuppliedOrBorrowed(el.asset) && (
                                                <span
                                                    className={`absolute -translate-x-4 ${
                                                        isCollateralized(el.asset)
                                                            ? 'translate-y-2'
                                                            : ''
                                                    } w-2 h-2 bg-brand-green-neon rounded-full`}
                                                />
                                            )}
                                            {isCollateralized(el.asset) && (
                                                <span className="absolute -translate-x-4 -translate-y-2 w-2 h-2 bg-brand-blue rounded-full" />
                                            )}
                                        </div>
                                        <AssetDisplay
                                            name={width > 600 ? el.asset : ''}
                                            logo={determineCoinImg(el.asset)}
                                            className="text-lg"
                                        />
                                    </div>
                                </td>
                                <td
                                    className={`${
                                        queryUserWallet.isLoading ? 'animate-pulse' : ''
                                    }`}
                                >
                                    <NumberAndDollar
                                        value={`${
                                            type === 'supply'
                                                ? `${bigNumberToNative(
                                                      BigNumber.from(
                                                          getTokenBalance(el.asset).amountNative,
                                                      ),
                                                      el.asset,
                                                  )} ${el.asset}`
                                                : `${bigNumberToNative(
                                                      amountBorrwable(el.asset).amountNative,
                                                      el.asset,
                                                  )} ${el.asset}`
                                        }`}
                                        dollar={`${
                                            type === 'supply'
                                                ? `${getTokenBalance(el.asset).amount}`
                                                : `${amountBorrwable(el.asset).amount}`
                                        }`}
                                        size="xs"
                                        color="text-brand-black"
                                    />
                                </td>
                                <td>{el.apy}</td>
                                <td>
                                    {type === 'supply' ? (
                                        <div className="w-8 h-8">
                                            {el.canBeCollat ? (
                                                <BsCheck className="w-full h-full text-green-500" />
                                            ) : (
                                                <IoIosClose className="w-full h-full text-red-500" />
                                            )}
                                            {/* <BasicToggle 
                                                checked={el.canBeCollat}
                                                onClick={(e: any) => {
                                                    e.preventDefault();
                                                    openDialog('confirmation-dialog', {
                                                        ...el,
                                                        message: `Are you sure you want to ${el.canBeCollat ? 'disable' : 'enable'} collateral for this asset? This will affect your health score.`,
                                                        action: () => handleCollateral(el, i),
                                                    })
                                                    e.stopPropagation();
                                                }}
                                            /> */}
                                        </div>
                                    ) : (
                                        `${numberFormatter.format(
                                            parseFloat(
                                                ethers.utils.formatUnits(
                                                    el.liquidity || '',
                                                    findAssetInMarketsData(el.asset).decimals,
                                                ),
                                            ) || 0,
                                        )} ${el.asset}`
                                    )}
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

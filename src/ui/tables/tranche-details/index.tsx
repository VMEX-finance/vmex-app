import { useSubgraphTrancheData, useUserData, useUserTrancheData, AvailableAsset } from '@/api';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import React, { useMemo } from 'react';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { useSelectedTrancheContext } from '@/store';
import { AssetDisplay, NumberAndDollar, ApyToolitp } from '@/ui/components';
import { useWindowSize, useDialogController } from '@/hooks';
import { BigNumber, ethers } from 'ethers';
import {
    numberFormatter,
    bigNumberToNative,
    percentFormatter,
    bigNumberToUSD,
    nativeAmountToUSD,
    PRICING_DECIMALS,
    DEFAULT_NETWORK,
    usdFormatter,
    NETWORKS,
    DEFAULT_CHAINID,
} from '@/utils';
import { useLocation } from 'react-router-dom';
import { IYourSuppliesTableItemProps } from '../portfolio';
import { getNetwork } from '@wagmi/core';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface ITableProps {
    data: AvailableAsset[];
    type: 'supply' | 'borrow';
}
export const TrancheTable: React.FC<ITableProps> = ({ data, type }) => {
    const location = useLocation();
    const { width, breakpoints } = useWindowSize();
    const { address } = useAccount();
    const { tranche } = useSelectedTrancheContext();
    const { queryUserWallet, getTokenBalance } = useUserData(address);
    const {
        queryUserTrancheData,
        findAmountBorrowable,
        findAssetInUserSuppliesOrBorrows,
        findAssetInRewards,
    } = useUserTrancheData(address, location.state?.trancheId);
    const { openConnectModal } = useConnectModal();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { findAssetInMarketsData } = useSubgraphTrancheData(location.state?.trancheId);
    const { openDialog } = useDialogController();

    const mode1 =
        type === 'supply'
            ? width > breakpoints.md
                ? 'Wallet Balance'
                : 'Balance'
            : width > breakpoints.md
            ? 'Available Borrows'
            : 'Available';

    const supplied =
        type === 'supply'
            ? width > breakpoints.md
                ? 'Supplied Amount'
                : 'Suppied'
            : width > breakpoints.md
            ? 'Borrowed Amount'
            : 'Borrowed';

    const mode2 =
        type === 'supply'
            ? width > breakpoints.md
                ? 'Can Collateralize'
                : 'Collateral'
            : width > breakpoints.md
            ? 'Total liquidity'
            : 'Liquidity';

    const isCollateralized = (asset: string) =>
        type === 'supply' &&
        (findAssetInUserSuppliesOrBorrows(asset || '', 'supply') as IYourSuppliesTableItemProps)
            ?.collateral;

    // TODO: check to see if user has rewards
    const hasRewards = (asset: string) =>
        findAssetInRewards(asset || '', tranche?.id || '', 'supply');

    const isSuppliedOrBorrowed = (asset: string) => {
        if (!queryUserTrancheData.data) return false;
        const list = (
            type === 'borrow'
                ? queryUserTrancheData.data.borrows
                : queryUserTrancheData.data.supplies
        ).map((el) => el.asset?.toLowerCase());

        return list.includes(asset?.toLowerCase()) ? true : false;
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

    const sortedList = useMemo(() => {
        if (data) return data.sort(compareListsSorter);
        return [];
    }, [data]);

    const network = getNetwork()?.chain?.unsupported
        ? DEFAULT_NETWORK
        : getNetwork()?.chain?.network || DEFAULT_NETWORK;

    const handleClick = (e: any, row: any) => {
        if (!address && openConnectModal) {
            return openConnectModal();
        }
        if (getNetwork()?.chain?.unsupported && switchNetworkAsync) {
            return switchNetworkAsync(DEFAULT_CHAINID);
        }
        return openDialog(type === 'supply' ? 'loan-asset-dialog' : 'borrow-asset-dialog', {
            asset: row.asset,
            trancheId: tranche.id,
            collateral: row.canBeCollat,
        });
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
                        {supplied}
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
                {sortedList.map((el, i) => {
                    return (
                        <tr
                            key={`${el.asset}-${i}`}
                            className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer"
                            onClick={(e) => handleClick(e, el)}
                        >
                            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                    <div className="flex flex-col justify-center gap-1 absolute -translate-x-4">
                                        {isSuppliedOrBorrowed(el.asset) && (
                                            <span
                                                className={` w-2 h-2 bg-brand-green-neon rounded-full`}
                                            />
                                        )}
                                        {isCollateralized(el.asset) && (
                                            <span className="w-2 h-2 bg-brand-blue rounded-full" />
                                        )}
                                        {hasRewards(el.asset) && (
                                            <span className="w-2 h-2 bg-brand-purple rounded-full" />
                                        )}
                                    </div>
                                    <AssetDisplay
                                        name={el.asset}
                                        className="text-lg"
                                        noText={width < breakpoints.md}
                                    />
                                </div>
                            </td>
                            <td className={`${queryUserWallet.isLoading ? 'animate-pulse' : ''}`}>
                                {type === 'supply' 
                                ? bigNumberToNative(
                                    findAssetInUserSuppliesOrBorrows(el.asset || '', 'supply')?.amountNative, el.asset
                                    ) !== '0'
                                    ? <NumberAndDollar
                                        value={`${bigNumberToNative(
                                                    findAssetInUserSuppliesOrBorrows(el.asset || '', 'supply')?.amountNative,
                                                    el.asset,
                                                )}`}
                                        dollar={`${(findAssetInUserSuppliesOrBorrows(el.asset || '', 'supply')?.amount ?? 0)}`} 
                                        size="xs"
                                        color="text-brand-black"
                                    />
                                    : '-'
                                    
                                : bigNumberToNative(
                                    findAssetInUserSuppliesOrBorrows(el.asset || '', 'borrow')?.amountNative, el.asset
                                    ) !== '0'
                                    ? <NumberAndDollar
                                        value={`${bigNumberToNative(
                                                    findAssetInUserSuppliesOrBorrows(el.asset || '', 'borrow')?.amountNative,
                                                    el.asset
                                                )}`}
                                        dollar={`${(findAssetInUserSuppliesOrBorrows(el.asset || '', 'borrow')?.amount ?? 0)}`} 
                                        size="xs"
                                        color="text-brand-black"
                                    />
                                    : '-'
                                }
                            </td>
                            <td className={`${queryUserWallet.isLoading ? 'animate-pulse' : ''}`}>
                                <NumberAndDollar
                                    value={`${
                                        type === 'supply'
                                            ? `${bigNumberToNative(
                                                BigNumber.from(
                                                    getTokenBalance(el.asset).amountNative,
                                                ),
                                                el.asset,
                                            )}`
                                            : `${bigNumberToNative(
                                                amountBorrwable(el.asset).amountNative,
                                                el.asset,
                                            )}`
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
                            <td>
                                {type === 'supply' ? (
                                    <ApyToolitp symbol={el.asset} oldApy={el.apy} />
                                ) : (
                                    percentFormatter.format(Number(el.apy) || 0)
                                )}
                            </td>
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
                                    <NumberAndDollar
                                        value={numberFormatter.format(
                                            parseFloat(
                                                ethers.utils.formatUnits(
                                                    el.liquidity || '',
                                                    findAssetInMarketsData(el.asset).decimals,
                                                ),
                                            ) || 0,
                                        )}
                                        dollar={usdFormatter(false).format(
                                            nativeAmountToUSD(
                                                el.liquidity || 0,
                                                PRICING_DECIMALS[network],
                                                Number(findAssetInMarketsData(el.asset).decimals),
                                                el.priceUSD || 0,
                                            ),
                                        )}
                                        size="xs"
                                        color="text-brand-black"
                                    />
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

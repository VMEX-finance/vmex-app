import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { BsCheck } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { ApyToolitp, AssetDisplay, Button, NumberAndDollar } from '@/ui/components';
import { useDialogController, useWindowSize } from '@/hooks';
import { IMarketsAsset, useUserData } from '@/api';
import {
    DEFAULT_CHAINID,
    bigNumberToNative,
    isChainUnsupported,
    numberFormatter,
    percentFormatter,
    usdFormatter,
} from '@/utils';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { BigNumber } from 'ethers';

export const GaugesCustomRow = (props: any) => {
    const {
        asset,
        tranche,
        trancheId,
        supplyApy,
        borrowApy,
        yourAmount,
        available,
        borrowTotal,
        supplyTotal,
        // rating,
        strategies,
        collateral,
        borrowable,
    } = props;
    const navigate = useNavigate();
    const { width } = useWindowSize();
    const { updateTranche, setAsset } = useSelectedTrancheContext();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { getTokenBalance } = useUserData(address);
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();

    const route = (e: Event, market: IMarketsAsset, view = 'overview') => {
        e.stopPropagation();
        setAsset(market.asset);
        updateTranche('id', market.trancheId.toString());
        navigate(`/tranches/${market.tranche.replace(/\s+/g, '-')}`, {
            state: { view, trancheId: market.trancheId.toString() },
        });
    };

    const handleActionClick = (e: any) => {
        e.stopPropagation();
        if (!address && openConnectModal) return openConnectModal();
        if (isChainUnsupported() && switchNetwork) return switchNetwork(DEFAULT_CHAINID);
        if (e.target.innerHTML === 'Supply') {
            openDialog('loan-asset-dialog', {
                asset: asset,
                trancheId: trancheId,
                collateral,
            });
        } else {
            openDialog('borrow-asset-dialog', {
                asset: asset,
                trancheId: trancheId,
                collateral,
            });
        }
    };

    // Mobile
    if (width < 900) {
        return (
            <tr
                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer flex flex-col px-4 pt-2 pb-1 border-y-[1px] dark:border-neutral-800"
                onClick={(e: any) => route(e, props)}
            >
                <td className="flex justify-between">
                    <span className="font-bold">Asset</span>
                    <div className="flex items-center gap-2">
                        <AssetDisplay name={asset} />
                    </div>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Vault APY</span>
                    <ApyToolitp symbol={asset} oldApy={supplyApy} />
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Deposited</span>
                    <span>{borrowable ? percentFormatter.format(borrowApy) : '-'}</span>
                </td>
                {address && (
                    <td className="flex justify-between">
                        <span className="font-bold">Gauge APR</span>
                        <span>
                            <NumberAndDollar
                                value={`${bigNumberToNative(
                                    BigNumber.from(getTokenBalance(asset).amountNative),
                                    asset,
                                )}`}
                                dollar={`${getTokenBalance(asset).amount}`}
                                size="xs"
                                color="text-brand-black"
                            />
                        </span>
                    </td>
                )}
                <td className="flex justify-between">
                    <span className="font-bold">Staked</span>
                    <span>{borrowable ? usdFormatter().format(available) : '-'}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Boost</span>
                    <span>{'-'}</span>
                </td>
                <td>
                    <Button
                        className="mt-1 mb-2"
                        type="accent"
                        left={{
                            text: 'Deposit',
                            disabled: false,
                            onClick: handleActionClick,
                        }}
                        right={{
                            text: 'Withdraw',
                            disabled: !borrowable,
                            onClick: handleActionClick,
                        }}
                    />
                </td>
            </tr>
        );
        // Desktop
    } else {
        return (
            <tr
                className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer border-y-[1px] dark:border-neutral-800"
                onClick={(e: any) => route(e, props, 'details')}
            >
                <td className="whitespace-nowrap pl-2 md:pl-4 pr-2 text-sm">
                    <AssetDisplay name={asset} />
                </td>
                <td className="min-w-[150px] pl-4 py-3">{percentFormatter.format(tranche)}</td>
                <td className="pl-4">{numberFormatter.format(0)}</td>
                <td className="pl-4">{borrowable ? numberFormatter.format(borrowApy) : '-'}</td>
                {address && (
                    <td className="pl-4">
                        <NumberAndDollar
                            value={`${bigNumberToNative(
                                BigNumber.from(getTokenBalance(asset).amountNative),
                                asset,
                            )}`}
                            dollar={`${getTokenBalance(asset).amount}`}
                            size="xs"
                            color="text-brand-black"
                        />
                    </td>
                )}
                <td className="pl-4">{borrowable ? usdFormatter().format(available) : '-'}</td>
                <td className="text-right pr-3.5">
                    <Button
                        type="accent"
                        left={{
                            text: 'Deposit',
                            disabled: true,
                            onClick: handleActionClick,
                        }}
                        right={{
                            text: 'Withdraw',
                            disabled: true,
                            onClick: handleActionClick,
                        }}
                    />
                </td>
            </tr>
        );
    }
};

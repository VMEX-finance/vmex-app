import React from 'react';
import { ApyToolitp, AssetDisplay, Button, Loader, SmartPrice } from '@/ui/components';
import { useDialogController, useWindowSize } from '@/hooks';
import { IVaultAsset } from '@/api';
import {
    DEFAULT_CHAINID,
    VMEX_VEVMEX_CHAINID,
    isChainUnsupported,
    percentFormatter,
} from '@/utils';
import { useAccount, useBalance, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { BigNumber, utils } from 'ethers';

export const GaugesCustomRow = (props: IVaultAsset & { loading?: boolean }) => {
    const {
        aTokenAddress,
        decimals,
        vaultName,
        vaultSymbol,
        vaultApy,
        vaultDeposited,
        gaugeAPR,
        gaugeBoost,
        gaugeStaked,
        actions,
        underlyingAddress,
        underlyingSymbol,
        underlyingDecimals,
        loading,
    } = props;
    const { width } = useWindowSize();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();
    const { data: gaugeBalance } = useBalance({
        address,
        token: aTokenAddress as `0x${string}`,
        chainId: VMEX_VEVMEX_CHAINID,
        watch: true,
    });

    const handleActionClick = (e: any, rowClick?: boolean) => {
        e.stopPropagation();
        if (!address && openConnectModal) return openConnectModal();
        if (isChainUnsupported() && switchNetwork) return switchNetwork(DEFAULT_CHAINID);
        openDialog('vault-asset-dialog', {
            ...props,
            tab: rowClick ? 'Deposit' : e.target.innerHTML,
        });
    };

    // Mobile
    if (width < 900) {
        return (
            <tr className="text-left transition duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:cursor-pointer flex flex-col px-4 pt-2 pb-1 border-y-[1px] dark:border-neutral-800">
                <td className="flex justify-between">
                    <span className="font-bold">Asset</span>
                    <div className="flex items-center gap-2">
                        <Loader loading={loading}>
                            <AssetDisplay name={vaultSymbol} />
                        </Loader>
                    </div>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Vault APY</span>
                    <Loader loading={loading}>
                        <ApyToolitp symbol={vaultSymbol} oldApy={vaultApy} />
                    </Loader>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Deposited</span>
                    <Loader loading={loading}>
                        <span className="flex items-center gap-1">
                            {vaultDeposited?.normalized ? (
                                <SmartPrice
                                    price={String(vaultDeposited?.normalized)}
                                    decimals={2}
                                />
                            ) : (
                                '-'
                            )}
                            {underlyingSymbol}
                        </span>
                    </Loader>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Gauge APR</span>
                    <Loader loading={loading}>
                        <span>{gaugeAPR ? percentFormatter.format(gaugeAPR) : '-'}</span>
                    </Loader>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Staked</span>
                    <Loader loading={loading}>
                        <span className="flex items-center gap-1">
                            {gaugeStaked?.normalized ? (
                                <SmartPrice price={String(gaugeStaked?.normalized)} decimals={2} />
                            ) : (
                                '-'
                            )}
                            {underlyingSymbol}
                        </span>
                    </Loader>
                </td>
                {/* <td className="flex justify-between">
                    <span className="font-bold">Boost</span>
                    <Loader loading={loading}>
                        <span>{gaugeBoost ? gaugeBoost : '-'}</span>
                    </Loader>
                </td> */}
                {/* <td>
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
                            disabled: false,
                            onClick: handleActionClick,
                        }}
                    />
                </td> */}
            </tr>
        );
        // Desktop
    } else {
        return (
            <tr
                className="text-left transition duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:cursor-pointer border-y-[1px] dark:border-neutral-800"
                // onClick={(e) => handleActionClick(e, true)}
            >
                <td className="whitespace-nowrap pl-2 md:pl-4 pr-1 text-sm">
                    <Loader loading={loading}>
                        <AssetDisplay name={vaultSymbol} />
                    </Loader>
                </td>
                <td className="min-w-[150px] pl-4 py-3 pr-1">
                    <Loader loading={loading}>
                        <ApyToolitp symbol={vaultName} oldApy={vaultApy} />
                    </Loader>
                </td>
                <td className="pl-4 pr-1">
                    <Loader loading={loading}>
                        <span className="flex items-center gap-1">
                            <SmartPrice
                                price={String(
                                    vaultDeposited?.normalized ? vaultDeposited?.normalized : '-',
                                )}
                            />
                            {underlyingSymbol}
                        </span>
                        <span
                            className={`flex items-center gap-1 text-xs leading-tight whitespace-nowrap ${
                                !gaugeBalance?.formatted || gaugeBalance?.formatted === '0.0'
                                    ? 'text-gray-400 dark:text-gray-600'
                                    : 'text-brand-purple'
                            }`}
                        >
                            <span>Your Stake:</span>
                            <SmartPrice
                                price={utils.formatUnits(
                                    gaugeBalance?.value || BigNumber.from(0),
                                    underlyingDecimals,
                                )}
                            />
                            <span>{underlyingSymbol}</span>
                        </span>
                    </Loader>
                </td>
                <td className="pl-4 pr-1">
                    <Loader loading={loading}>
                        {gaugeAPR
                            ? `${percentFormatter.format(gaugeAPR / 10)}` +
                              '-' +
                              `${percentFormatter.format(gaugeAPR)}`
                            : '-'}
                    </Loader>
                </td>
                {/* <td className="pl-4">
                    <Loader loading={loading}>{gaugeBoost ? gaugeBoost : '-'}</Loader>
                </td> */}
                {/* <td className="text-right pr-2">
                    <Button
                        type="accent"
                        left={{
                            text: 'Deposit',
                            disabled: false,
                            onClick: handleActionClick,
                        }}
                        right={{
                            text: 'Withdraw',
                            disabled: false,
                            onClick: handleActionClick,
                        }}
                    />
                </td> */}
            </tr>
        );
    }
};

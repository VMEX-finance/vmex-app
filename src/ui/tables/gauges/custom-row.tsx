import React from 'react';
import { ApyToolitp, AssetDisplay, Button, Loader, SmartPrice } from '@/ui/components';
import { useDialogController, useWindowSize } from '@/hooks';
import { IVaultAsset, useUserData } from '@/api';
import { DEFAULT_CHAINID, isChainUnsupported, percentFormatter } from '@/utils';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const GaugesCustomRow = (props: IVaultAsset & { loading?: boolean }) => {
    const {
        gaugeAddress,
        vaultAddress,
        decimals,
        vaultName,
        vaultSymbol,
        vaultApy,
        vaultDeposited,
        gaugeAPR,
        gaugeBoost,
        gaugeStaked,
        actions,
        loading,
    } = props;
    const { width } = useWindowSize();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { getTokenBalance } = useUserData(address);
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();

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
            <tr className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer flex flex-col px-4 pt-2 pb-1 border-y-[1px] dark:border-neutral-800">
                <td className="flex justify-between">
                    <span className="font-bold">Asset</span>
                    <div className="flex items-center gap-2">
                        <Loader loading={loading}>
                            <AssetDisplay name={vaultName} />
                        </Loader>
                    </div>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Vault APY</span>
                    <Loader loading={loading}>
                        <ApyToolitp symbol={vaultName} oldApy={vaultApy} />
                    </Loader>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Deposited</span>
                    <Loader loading={loading}>
                        <span>{vaultDeposited?.normalized ? vaultDeposited?.normalized : '-'}</span>
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
                        <span>{gaugeStaked?.normalized ? gaugeStaked?.normalized : '-'}</span>
                    </Loader>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Boost</span>
                    <Loader loading={loading}>
                        <span>{gaugeBoost ? gaugeBoost : '-'}</span>
                    </Loader>
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
                            disabled: false,
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
                onClick={(e) => handleActionClick(e, true)}
            >
                <td className="whitespace-nowrap pl-2 md:pl-4 pr-2 text-sm">
                    <Loader loading={loading}>
                        <AssetDisplay name={vaultSymbol} />
                    </Loader>
                </td>
                <td className="min-w-[150px] pl-4 py-3">
                    <Loader loading={loading}>
                        <ApyToolitp symbol={vaultName} oldApy={vaultApy} />
                    </Loader>
                </td>
                <td className="pl-4">
                    <Loader loading={loading}>
                        <SmartPrice
                            price={String(
                                vaultDeposited?.normalized ? vaultDeposited?.normalized : '-',
                            )}
                        />
                    </Loader>
                </td>
                <td className="pl-4">
                    {' '}
                    <Loader loading={loading}>
                        {gaugeAPR ? percentFormatter.format(gaugeAPR) : '-'}
                    </Loader>
                </td>
                <td className="pl-4">
                    {' '}
                    <Loader loading={loading}>
                        <SmartPrice
                            price={String(gaugeStaked?.normalized ? gaugeStaked?.normalized : '-')}
                        />
                    </Loader>
                </td>
                <td className="pl-4">
                    <Loader loading={loading}>{gaugeBoost ? gaugeBoost : '-'}</Loader>
                </td>
                <td className="text-right pr-3.5">
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
                </td>
            </tr>
        );
    }
};

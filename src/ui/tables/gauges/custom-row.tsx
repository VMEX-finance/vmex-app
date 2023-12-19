import React from 'react';
import { ApyToolitp, AssetDisplay, Button } from '@/ui/components';
import { useDialogController, useWindowSize } from '@/hooks';
import { IVaultAsset, useUserData } from '@/api';
import { DEFAULT_CHAINID, isChainUnsupported } from '@/utils';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const GaugesCustomRow = (props: IVaultAsset) => {
    const {
        gaugeAddress,
        vaultAddress,
        decimals,
        vaultIcon,
        vaultName,
        vaultApy,
        vaultDeposited,
        gaugeAPR,
        gaugeBoost,
        gaugeStaked,
        actions,
    } = props;
    const { width } = useWindowSize();
    const { openDialog } = useDialogController();
    const { address } = useAccount();
    const { getTokenBalance } = useUserData(address);
    const { switchNetwork } = useSwitchNetwork();
    const { openConnectModal } = useConnectModal();

    const handleActionClick = (e: any) => {
        e.stopPropagation();
        if (!address && openConnectModal) return openConnectModal();
        if (isChainUnsupported() && switchNetwork) return switchNetwork(DEFAULT_CHAINID);
        //     openDialog('vault-dialog', {
        //         asset: asset,
        //         trancheId: trancheId,
        //         collateral,
        //         tab: e.target.innerHTML
        //     });
    };

    // Mobile
    if (width < 900) {
        return (
            <tr className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer flex flex-col px-4 pt-2 pb-1 border-y-[1px] dark:border-neutral-800">
                <td className="flex justify-between">
                    <span className="font-bold">Asset</span>
                    <div className="flex items-center gap-2">
                        <AssetDisplay name={vaultName} logo={vaultIcon} />
                    </div>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Vault APY</span>
                    <ApyToolitp symbol={vaultName} oldApy={vaultApy} />
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Deposited</span>
                    <span>{vaultDeposited?.normalized ? vaultDeposited?.normalized : '-'}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Gauge APR</span>
                    <span>{gaugeAPR ? gaugeAPR : '-'}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Staked</span>
                    <span>{gaugeStaked?.normalized ? gaugeStaked?.normalized : '-'}</span>
                </td>
                <td className="flex justify-between">
                    <span className="font-bold">Boost</span>
                    <span>{gaugeBoost ? gaugeBoost : '-'}</span>
                </td>
                <td>
                    <Button
                        className="mt-1 mb-2"
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
        // Desktop
    } else {
        return (
            <tr className="text-left transition duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:cursor-pointer border-y-[1px] dark:border-neutral-800">
                <td className="whitespace-nowrap pl-2 md:pl-4 pr-2 text-sm">
                    <AssetDisplay name={vaultName} logo={vaultIcon} />
                </td>
                <td className="min-w-[150px] pl-4 py-3">
                    <ApyToolitp symbol={vaultName} oldApy={vaultApy} />
                </td>
                <td className="pl-4">
                    {vaultDeposited?.normalized ? vaultDeposited?.normalized : '-'}
                </td>
                <td className="pl-4">{gaugeAPR ? gaugeAPR : '-'}</td>
                <td className="pl-4">{gaugeStaked?.normalized ? gaugeStaked?.normalized : '-'}</td>
                <td className="pl-4">{gaugeBoost ? gaugeBoost : '-'}</td>
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

import React, { useEffect } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader, ModalTableDisplay } from '../subcomponents';
import { useModal, useVault } from '@/hooks';
import { Button, TransactionStatus, CoinInput, DefaultAccordion } from '@/ui/components';
import { VaultDetails } from '@/ui/features/vault-details';
import { VMEX_VEVMEX_CHAINID, getChainId, toSymbol } from '@/utils';
import { useAccount, useSwitchNetwork, useFeeData } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useSelectedTrancheContext } from '@/store';
import { BigNumber, utils } from 'ethers';

export const VaultAssetDialog: React.FC<IDialogProps> = ({ name, isOpen, data, closeDialog }) => {
    const { address } = useAccount();
    const navigate = useNavigate();
    const chainId = getChainId();
    const { switchNetworkAsync } = useSwitchNetwork();
    const { submitTx, isSuccess, isLoading, error, view, setView } = useModal('vault-asset-dialog');
    const {
        amount,
        setAmount,
        isMax,
        setIsMax,
        handleDeposit,
        handleWithdraw,
        approvedEnough,
        loading,
        vaultBalance,
        gaugeBalance,
        underlying,
    } = useVault(data?.vaultAddress, data?.gaugeAddress, data?.vaultSymbol);
    const { data: gas } = useFeeData();
    const { updateTranche, setAsset } = useSelectedTrancheContext();

    const handleSubmit = async (e: any) => {
        if (chainId !== VMEX_VEVMEX_CHAINID && switchNetworkAsync)
            await switchNetworkAsync(VMEX_VEVMEX_CHAINID);
        if (view === 'Deposit') {
            await handleDeposit(e);
        } else {
            await handleWithdraw(e);
        }
    };

    const renderBtnText = () => {
        if (chainId !== VMEX_VEVMEX_CHAINID) return 'Switch Network';
        if (view === 'Deposit') {
            if (approvedEnough) {
                return 'Deposit';
            }
            return 'Approve';
        }
        return 'Withdraw';
    };

    const route = (
        e: Event,
        symbol?: string,
        trancheId?: string | number,
        trancheName?: string,
    ) => {
        e.stopPropagation();
        if (!trancheId || !trancheName || !symbol) return;
        setAsset(symbol);
        updateTranche('id', trancheId.toString());
        closeDialog && closeDialog('vault-asset-dialog');
        navigate(`/tranches/${trancheName.replace(/\s+/g, '-')?.toLowerCase()}`, {
            state: {
                view,
                trancheId: trancheId.toString(),
                from: 'gauges',
                data,
                action: 'supply',
                asset: underlying?.asset,
            },
        });
    };

    useEffect(() => {
        if (data?.tab) setView(data?.tab);
    }, []);

    const depositToken = data?.vaultSymbol?.split('-')?.[1] ?? '';
    return (
        <>
            <ModalHeader
                dialog="vault-asset-dialog"
                tabs={[`Deposit`, 'Withdraw']}
                onClick={setView}
                active={view}
                disabled={isLoading}
            />
            {!isSuccess && !error ? (
                // Default State
                <>
                    <h3 className="mt-3 text-neutral400">Vault Details</h3>
                    <VaultDetails
                        vault={data}
                        deposited={utils.formatUnits(
                            gaugeBalance?.value || BigNumber.from(0),
                            underlying?.decimals || 18,
                        )}
                    />
                    <h3 className="text-neutral400 mt-2">Amount</h3>
                    <CoinInput
                        amount={amount}
                        setAmount={setAmount}
                        coin={{
                            name: data.vaultSymbol,
                        }}
                        balance={
                            (view === 'Deposit'
                                ? vaultBalance?.formatted
                                : utils.formatUnits(
                                      gaugeBalance?.value || BigNumber.from(0),
                                      underlying?.decimals || 18,
                                  )) || '0.0'
                        }
                        isMax={isMax}
                        setIsMax={setIsMax}
                        type={`staking-${view?.toLowerCase() || 'deposit'}` as any}
                    />
                    {view === 'Deposit' ? (
                        <>
                            <DefaultAccordion
                                wrapperClass="!border-0 "
                                customHover="hover:!text-brand-purple"
                                detailsClass="!bg-white dark:!bg-brand-black !border-0"
                                className="!px-0 !hover:!bg-inherit !bg-white dark:!bg-brand-black dark:disabled:!opacity-100 "
                                title={`how-it-works-vault-asset`}
                                summary={<span>How do I get {depositToken}?</span>}
                                details={
                                    <div className="px-2 mb-2">
                                        <span>
                                            Earn rewards with {depositToken} by depositing{' '}
                                            {underlying?.asset} in {underlying?.tranche}.
                                        </span>
                                        <ol className="list-decimal px-5 text-sm">
                                            <li>Go to {underlying?.tranche}</li>
                                            <li>
                                                Deposit {underlying?.asset} to get {depositToken}{' '}
                                                receipt tokens
                                            </li>
                                            <li>Return here and stake your {depositToken}</li>
                                        </ol>
                                    </div>
                                }
                            />
                            <ModalTableDisplay
                                title="Transaction Overview"
                                titleClass="mb-0.5"
                                content={[
                                    {
                                        label: 'Estimated Gas',
                                        value: `${gas?.formatted.gasPrice} gwei`,
                                    },
                                ]}
                            />
                        </>
                    ) : (
                        <ModalTableDisplay
                            title="Transaction Overview"
                            content={[
                                {
                                    label: 'Remaining Supply',
                                    value: `${
                                        Number(data?.gaugeStaked?.normalized || '0') -
                                        Number(amount || '0')
                                    }`,
                                },
                                {
                                    label: 'Estimated Gas',
                                    value: `${gas?.formatted.gasPrice} gwei`,
                                },
                            ]}
                        />
                    )}
                </>
            ) : (
                <div className="mt-10 mb-8">
                    <TransactionStatus success={isSuccess} errorText={error} full />
                </div>
            )}

            <ModalFooter between>
                <Button
                    type="outline"
                    onClick={(e: any) =>
                        route(e, underlying?.asset, underlying?.trancheId, underlying?.tranche)
                    }
                >
                    Deposit {underlying?.asset}{' '}
                    <span className="hidden sm:block sm:ml-0.5">for {depositToken}</span>
                </Button>
                <Button
                    disabled={isSuccess}
                    onClick={handleSubmit}
                    loading={
                        isLoading || loading.deposit || loading.depositApprove || loading.withdraw
                    }
                    type="accent"
                >
                    {renderBtnText()}
                </Button>
            </ModalFooter>
        </>
    );
};
